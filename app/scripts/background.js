(function() {
  (function(global) {
    chrome.runtime.onInstalled.addListener(function(details) {
      if ((details != null ? details.reason : void 0) === "install") {
        return chrome.storage.local.get("libraries", function(res) {
          var libraries;
          libraries = (res != null ? res.libraries : void 0) || {};
          libraries["MHMchiX6c1bwSqGM1PZiW_PxhMjh3Sh48"] = {
            "desc": "moment.js ~Parse, validate, manipulate, and display dates in javascrip~",
            "longDesc": "[moment.js](http://momentjs.com/) for Google Apps Script. See [Detail](https://plus.google.com/+EricKoleda/posts/ThnVjUgU3E9).",
            "key": "MHMchiX6c1bwSqGM1PZiW_PxhMjh3Sh48",
            "label": "Moment",
            "modifiedAt": 1370425075000,
            "published": true,
            "registeredAt": 1370425075000,
            "sourceUrl": "https://script.google.com/d/MHMchiX6c1bwSqGM1PZiW_PxhMjh3Sh48/edit"
          };
          libraries["1I21uLOwDKdyF3_W_hvh6WXiIKWJWno8yG9lB8lf1VBnZFQ6jAAhyNTRG"] = {
            "desc": "Underscore.js is a JavaScript library that provides a whole mess of useful functional programming helpers without extending any built-in objects",
            "longDesc": "[Underscore.js](http://underscorejs.org/) for Google Apps Script. See [Detail](http://googleappsdeveloper.blogspot.jp/2012/11/using-open-source-libraries-in-apps.html).",
            "key": "1I21uLOwDKdyF3_W_hvh6WXiIKWJWno8yG9lB8lf1VBnZFQ6jAAhyNTRG",
            "label": "Underscore",
            "modifiedAt": 1354014480000,
            "published": true,
            "registeredAt": 1354014480000,
            "sourceUrl": "https://script.google.com/d/1I21uLOwDKdyF3_W_hvh6WXiIKWJWno8yG9lB8lf1VBnZFQ6jAAhyNTRG/edit"
          };
          return chrome.storage.local.set({
            "libraries": libraries
          }, function() {
            return global.showOptionPage();
          });
        });
      }
    });
    chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
      var result;
      console.log(message, sender, sendResponse);
      result = (global[message.action] || function() {
        return "no command";
      }).apply(global, [message]);
      return sendResponse && sendResponse({
        values: result
      });
    });
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
      if (!tab.url) {
        return;
      }
      if (tab.url.indexOf("script.google.com") > -1) {
        return chrome.pageAction.show(tabId);
      }
    });
    global.showOptionPage = function() {
      return chrome.tabs.create({
        url: chrome.extension.getURL("options.html")
      });
    };
    global.showMyLibraryPage = function(message) {
      return chrome.tabs.create({
        url: "" + (chrome.extension.getURL('options.html')) + "#/mine/detail/" + message.key
      });
    };
    return global.logEvent = function(message) {
      return _gaq.push(['_trackEvent', message.source, message.event, message.from]);
    };
  })(this);

}).call(this);
