(function() {
  (function(global) {
    chrome.runtime.onInstalled.addListener(function(prev) {
      return global.showOptionPage();
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
    global.showOptionPage = function() {
      return chrome.tabs.create({
        url: chrome.extension.getURL("options.html")
      });
    };
    return global.showMyLibraryPage = function(message) {
      console.log(arguments);
      return chrome.tabs.create({
        url: "${chrome.extension.getURL('options.html')}#/mine/detail/" + message.key
      });
    };
  })(this);

}).call(this);
