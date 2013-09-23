(function() {
  (function($, global) {
    "use strict";
    var $saveButton, $saveMessageBox, escapeHTML;
    $saveMessageBox = $('<div>');
    $saveButton = $("<button type=\"button\" class=\"gwt-Button\">" + (chrome.i18n.getMessage('saveButton')) + "</button>").click(function() {
      var item, propertyRows;
      $saveMessageBox.empty();
      propertyRows = $('.properties-box').find("input.info-row");
      item = {
        "label": $(propertyRows.get(0)).val(),
        "desc": $(propertyRows.get(1)).val(),
        "key": $(propertyRows.get(2)).val(),
        "sourceUrl": location.href
      };
      return chrome.storage.local.get("libraries", function(res) {
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
        return chrome.storage.local.set({
          "libraries": libraries
        }, function() {
          return $saveMessageBox.text(chrome.i18n.getMessage("saved", item.label));
        });
      });
    });
    document.addEventListener("webkitAnimationStart", (function(event) {
      console.log(event.animationName);
      return (global[event.animationName] || function() {
        return this;
      }).apply(this, event);
    }), true);
    global.showProperteisBox = function(event) {
      return $('.properties-box').closest('.dialogMiddle').find('.buttons').append($saveButton.clone(true)).append($saveMessageBox);
    };
    global.showDependencyDialog = function(event) {
      return chrome.storage.local.get("libraries", function(res) {
        var $info, $text, item, key, libraries, source;
        console.log(res);
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
        $info = $("<div>").appendTo($('div.dependency-dialog .find'));
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
            $info.html("<a href=\"" + ui.item.sourceUrl + "\">" + (escapeHTML(ui.item.label)) + "</a>");
            return false;
          },
          select: function(event, ui) {
            $text.val(ui.item.value);
            $info.html("<a href=\"" + ui.item.sourceUrl + "\">" + (escapeHTML(ui.item.label)) + "</a>");
            return false;
          }
        });
        return $text.data("ui-autocomplete")._renderItem = function(ul, item) {
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
      });
    };
    return escapeHTML = function(str) {
      return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    };
  })(jQuery, this);

}).call(this);
