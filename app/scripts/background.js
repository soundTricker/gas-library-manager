(function() {
  (function(global) {
    chrome.runtime.onInstalled.addListener(function(details) {
      if ((details != null ? details.reason : void 0) === "install") {
        return global.showOptionPage();
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
    return global.showMyLibraryPage = function(message) {
      return chrome.tabs.create({
        url: "" + (chrome.extension.getURL('options.html')) + "#/mine/detail/" + message.key
      });
    };
  })(this);

}).call(this);
