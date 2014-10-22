(function() {
  (function($, global) {
    "use strict";
    var $saveButton, $saveMessageBox, escapeHTML, generateLinks;
    $saveMessageBox = $('<div>');
    $saveButton = $("<button type=\"button\" class=\"saveButton gwt-Button\">" + (chrome.i18n.getMessage('saveButton')) + "</button>").click(function() {
      var $table, item, projectKey, propertyRows;
      $saveMessageBox.empty();
      $table = $($('.modal-dialog.properties-data-dialog .properties-data-dialog-table').get(0));
      propertyRows = $table.find("input.editable-row-input");
      projectKey = $table.find(".properties-data-dialog-table-row:nth-child(5)>td:nth-child(2)>div");
      console.log(projectKey);
      item = {
        "label": $(propertyRows.get(0)).val(),
        "desc": $(propertyRows.get(1)).val(),
        "key": projectKey.text(),
        "sourceUrl": location.href
      };
      console.log(item);
      chrome.storage.local.get("libraries", function(res) {
        var libraries, origin;
        libraries = (res != null ? res.libraries : void 0) || {};
        if (libraries[item.key]) {
          origin = libraries[item.key];
          origin.label = item.label;
          origin.desc = item.desc;
          origin.modifiedAt = new Date().getTime();
          libraries[item.key] = origin;
        } else {
          item.registeredAt = new Date().getTime();
          item.modifiedAt = item.registeredAt;
          libraries[item.key] = item;
        }
        chrome.storage.local.set({
          "libraries": libraries
        }, function() {
          return $saveMessageBox.text(chrome.i18n.getMessage("saved", item.label));
        });
        return chrome.runtime.sendMessage({
          action: "logEvent",
          "event": "saveLibrary",
          "source": "saveButton",
          "from": "content_script"
        });
      });
      return false;
    });
    document.addEventListener("webkitAnimationStart", (function(event) {
      return (global[event.animationName] || function() {
        return this;
      }).apply(this, event);
    }), true);
    global.showProperteisBox = function(event) {
      $saveMessageBox.empty();
      if ($(".saveButton").length > 0) {
        return;
      }
      return $('.modal-dialog.properties-data-dialog').find('.modal-dialog-buttons').append($saveButton.clone(true)).append($saveMessageBox);
    };
    generateLinks = function(item) {
      return $("<div>").append($("<h3>").text(item.label)).append($("<p>", {
        "text": item.desc
      })).append($("<a>", {
        "href": item.sourceUrl,
        "on": {
          "click": function() {
            return chrome.runtime.sendMessage({
              action: "logEvent",
              "event": "viewSource",
              "source": "viewSourceLink",
              "from": "content_script"
            });
          }
        },
        "text": "View source",
        "target": "_blank"
      }).button()).append($("<a>", {
        "on": {
          "click": function() {
            chrome.runtime.sendMessage({
              action: "logEvent",
              "event": "viewMyLibraryPage",
              "source": "viewDetailLink",
              "from": "content_script"
            });
            return chrome.runtime.sendMessage({
              action: "showMyLibraryPage",
              key: item.value
            });
          }
        },
        "href": "javascript:",
        "text": "View detail"
      }).button());
    };
    global.showDependencyDialog = function(event) {
      return chrome.storage.local.get("libraries", function(res) {
        var $info, $text, autocomp, item, key, libraries, source;
        libraries = (res != null ? res.libraries : void 0) || {};
        source = (function() {
          var _results;
          _results = [];
          for (key in libraries) {
            item = libraries[key];
            if (item.key) {
              _results.push({
                value: item.key,
                label: item.label,
                desc: item.desc,
                sourceUrl: item.sourceUrl
              });
            }
          }
          return _results;
        })();
        $info = $("<div>").appendTo($('div.dependency-dialog').closest(".maestro-dialog"));
        $text = $('div.dependency-dialog input.gwt-TextBox.textbox').autocomplete({
          minLength: 2,
          source: function(request, response) {
            var matcher;
            matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
            return response($.grep(source, function(value) {
              return matcher.test(value.label) || matcher.test(value.desc) || matcher.test(value.key);
            }));
          },
          focus: function(event, ui) {
            $text.val(ui.item.value);
            $info.empty().append(generateLinks(ui.item));
            return false;
          },
          select: function(event, ui) {
            $text.val(ui.item.value);
            $info.empty().append(generateLinks(ui.item));
            return true;
          }
        });
        autocomp = $text.data("ui-autocomplete");
        autocomp._renderItem = function(ul, item) {
          var $a, $li, desc, label, matcher;
          $li = $("<li>");
          matcher = new RegExp("(" + ($.ui.autocomplete.escapeRegex(this.term)) + ")", "ig");
          label = item.label.replace(matcher, function($1, match) {
            return "<strong>" + (escapeHTML(match)) + "</strong>";
          });
          $a = $("<a>").html(label);
          if (item.desc) {
            desc = item.desc.replace(matcher, function($1, match) {
              return "<strong>" + (escapeHTML(match)) + "</strong>";
            });
            $a.append("<p><small> " + desc + "</small></p>");
          }
          return $li.append($a).appendTo(ul);
        };
        return autocomp._renderMenu = function(ul, items) {
          var that;
          that = this;
          $("<li>").append($("<b>", {
            text: "Choose library by Keyboard's Up or Down"
          })).appendTo(ul);
          return $.each(items, function(index, item) {
            return that._renderItemData(ul, item);
          });
        };
      });
    };
    return escapeHTML = function(str) {
      return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    };
  })(jQuery, this);

}).call(this);
