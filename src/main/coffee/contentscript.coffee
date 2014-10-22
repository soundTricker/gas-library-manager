do($=jQuery, global=@) ->
  "use strict"

  $saveMessageBox = $ '<div>'
  $saveButton = $("<button type=\"button\" class=\"saveButton gwt-Button\">#{chrome.i18n.getMessage('saveButton')}</button>").click ()->
    $saveMessageBox.empty()
    $table = $($('.modal-dialog.properties-data-dialog .properties-data-dialog-table').get(0))
    propertyRows = $table.find "input.editable-row-input"
    projectKey = $table.find ".properties-data-dialog-table-row:nth-child(5)>td:nth-child(2)>div"
    console.log projectKey
    item =
      "label" : $(propertyRows.get(0)).val()
      "desc" : $(propertyRows.get(1)).val()
      "key"  : projectKey.text()
      "sourceUrl"  : location.href
    console.log item
    chrome.storage.local.get "libraries" , (res)->
      libraries = res?.libraries || {}

      if libraries[item.key]
        origin = libraries[item.key]
        origin.label = item.label
        origin.desc = item.desc
        origin.modifiedAt = new Date().getTime()
        libraries[item.key] = origin
      else
        item.registeredAt = new Date().getTime()
        item.modifiedAt = item.registeredAt
        libraries[item.key] = item

      chrome.storage.local.set {"libraries" : libraries} , ()->
        $saveMessageBox.text chrome.i18n.getMessage("saved", item.label)

      chrome.runtime.sendMessage {action : "logEvent" , "event" : "saveLibrary" , "source" : "saveButton", "from" : "content_script"}
    return false

  document.addEventListener "webkitAnimationStart", ((event) ->
    (global[event.animationName] || ()->@).apply(this,event)

  ), true

  global.showProperteisBox = (event)->
    $saveMessageBox.empty()
    return if $(".saveButton").length > 0
    $('.modal-dialog.properties-data-dialog').find('.modal-dialog-buttons').append($saveButton.clone(true)).append($saveMessageBox)

  generateLinks = (item)->
    return $("<div>")
      .append($("<h3>").text(item.label))
      .append($("<p>" ,
        "text" : item.desc
      ))
      .append($("<a>" ,
        "href" : item.sourceUrl
        "on" :
          "click" : ()-> chrome.runtime.sendMessage {action : "logEvent" , "event" : "viewSource" , "source" : "viewSourceLink", "from" : "content_script"}
        "text" : "View source"
        "target" : "_blank"
      ).button())
      .append($("<a>",
        "on" :
          "click" : ()->
            chrome.runtime.sendMessage {action : "logEvent" , "event" : "viewMyLibraryPage" , "source" : "viewDetailLink", "from" : "content_script"}
            chrome.runtime.sendMessage {action : "showMyLibraryPage", key : item.value}
        "href" : "javascript:"
        "text" : "View detail"
      ).button())

  global.showDependencyDialog = (event)->
    chrome.storage.local.get "libraries",(res)->
      libraries = res?.libraries || {}

      source = ({value:item.key, label:item.label ,desc : item.desc, sourceUrl : item.sourceUrl} for key, item of libraries when item.key)

      $info = $("<div>").appendTo $('div.dependency-dialog').closest(".maestro-dialog")

      $text = $('div.dependency-dialog input.gwt-TextBox.textbox').autocomplete(
        minLength : 2
        source : (request, response)->
          matcher = new RegExp $.ui.autocomplete.escapeRegex(request.term) , "i"
          response(
            $.grep(source, (value)->
              matcher.test(value.label) or matcher.test(value.desc) or matcher.test(value.key)
            )
          )
        focus : (event, ui)->
          $text.val ui.item.value
          $info.empty().append(generateLinks(ui.item)) # "<a href=\"#{ui.item.sourceUrl}\">#{escapeHTML(ui.item.label)}</a>"
          return false
        select : (event, ui)->
          $text.val ui.item.value
          $info.empty().append(generateLinks(ui.item)) # "<a href=\"#{ui.item.sourceUrl}\">#{escapeHTML(ui.item.label)}</a>"
          return true
      )

      autocomp = $text.data("ui-autocomplete")
      autocomp._renderItem = (ul, item)->
        $li = $("<li>")
        matcher = new RegExp "(#{$.ui.autocomplete.escapeRegex(@term)})" , "ig"
        label = item.label.replace(matcher,($1, match) ->
            "<strong>#{escapeHTML(match)}</strong>"
        )
        $a = $("<a>").html(label)
        if item.desc
          desc = item.desc.replace(matcher, ($1, match)->
            "<strong>#{escapeHTML(match)}</strong>"
          )
          $a.append("<p><small> #{desc}</small></p>")
        $li.append($a).appendTo(ul)
      autocomp._renderMenu = (ul, items)->
        that = @
        $("<li>").append($("<b>", text : "Choose library by Keyboard's Up or Down")).appendTo ul
        $.each items , (index, item)-> that._renderItemData ul, item

  escapeHTML = (str)->
    str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")


