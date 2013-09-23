do($=jQuery, global=@) ->
  "use strict"

  $saveMessageBox = $ '<div>'

  $saveButton = $("<button type=\"button\" class=\"gwt-Button\">#{chrome.i18n.getMessage('saveButton')}</button>").click ()->
    $saveMessageBox.empty()
    propertyRows = $('.properties-box').find "input.info-row"
    item = 
      "label" : $(propertyRows.get(0)).val()
      "desc" : $(propertyRows.get(1)).val()
      "key"  : $(propertyRows.get(2)).val()
      "sourceUrl"  : location.href

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

  document.addEventListener "webkitAnimationStart", ((event) ->
    console.log event.animationName
    (global[event.animationName] || ()->@).apply(this,event)

  ), true

  global.showProperteisBox = (event)-> 
    $('.properties-box').closest('.dialogMiddle').find('.buttons').append($saveButton.clone(true)).append($saveMessageBox)

  global.showDependencyDialog = (event)->
    chrome.storage.local.get "libraries",(res)->
      console.log res
      libraries = res?.libraries || {}

      source = ({value:item.key, label:item.label ,desc : item.desc, sourceUrl : item.sourceUrl} for key, item of libraries when item.key)

      $info = $("<div>").appendTo $('div.dependency-dialog .find')

      $text = $('div.dependency-dialog input.gwt-TextBox.textbox').autocomplete
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
          $info.html "<a href=\"#{ui.item.sourceUrl}\">#{escapeHTML(ui.item.label)}</a>"
          return false
        select : (event, ui)->
          $text.val ui.item.value
          $info.html "<a href=\"#{ui.item.sourceUrl}\">#{escapeHTML(ui.item.label)}</a>"
          return false

      $text.data("ui-autocomplete")._renderItem = (ul, item)->
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

  escapeHTML = (str)->
    str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")


