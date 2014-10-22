do(global=@)->
  chrome.runtime.onInstalled.addListener (details)->

    if details?.reason is "install"
        chrome.storage.local.get "libraries" , (res)->
            libraries = res?.libraries || {}
            libraries["MHMchiX6c1bwSqGM1PZiW_PxhMjh3Sh48"] =
                "desc": "moment.js ~Parse, validate, manipulate, and display dates in javascrip~"
                "longDesc": "[moment.js](http://momentjs.com/) for Google Apps Script. See [Detail](https://plus.google.com/+EricKoleda/posts/ThnVjUgU3E9).",
                "key": "MHMchiX6c1bwSqGM1PZiW_PxhMjh3Sh48",
                "label": "Moment",
                "modifiedAt": 1370425075000,
                "published": true,
                "registeredAt": 1370425075000,
                "sourceUrl": "https://script.google.com/d/MHMchiX6c1bwSqGM1PZiW_PxhMjh3Sh48/edit"
            libraries["1I21uLOwDKdyF3_W_hvh6WXiIKWJWno8yG9lB8lf1VBnZFQ6jAAhyNTRG"] =
                "desc": "Underscore.js is a JavaScript library that provides a whole mess of useful functional programming helpers without extending any built-in objects"
                "longDesc": "[Underscore.js](http://underscorejs.org/) for Google Apps Script. See [Detail](http://googleappsdeveloper.blogspot.jp/2012/11/using-open-source-libraries-in-apps.html).",
                "key": "1I21uLOwDKdyF3_W_hvh6WXiIKWJWno8yG9lB8lf1VBnZFQ6jAAhyNTRG",
                "label": "Underscore",
                "modifiedAt": 1354014480000,
                "published": true,
                "registeredAt": 1354014480000,
                "sourceUrl": "https://script.google.com/d/1I21uLOwDKdyF3_W_hvh6WXiIKWJWno8yG9lB8lf1VBnZFQ6jAAhyNTRG/edit"
            chrome.storage.local.set {"libraries" : libraries} , ()->
                global.showOptionPage()

  chrome.extension.onMessage.addListener (message, sender, sendResponse)->
    console.log message, sender, sendResponse
    result = (global[message.action] || ()-> "no command").apply global, [message]
    sendResponse && sendResponse values : result

  chrome.tabs.onUpdated.addListener (tabId, changeInfo, tab)->
    return if !tab.url
    chrome.pageAction.show tabId if tab.url.indexOf("script.google.com") > -1

  global.showOptionPage = ()->
    chrome.tabs.create url : chrome.extension.getURL("options.html")

  global.showMyLibraryPage = (message)->
    chrome.tabs.create url : "#{chrome.extension.getURL('options.html')}#/mine/detail/#{message.key}"

  global.logEvent = (message)->
    _gaq.push(['_trackEvent',message.source,message.event, message.from])

# do(global=@)->
#   chrome.extension.onRequest.addListener (message, sender, sendResponse)->
#     result = (global[message.action] || ()-> "no command").apply global, message.args

#     sendResponse values : result

#   global.addLibrary = (key , item)->
#     libraries = JSON.parse(global.getValue("libraries", "[]"))
#     libraries[key] = item
#     global.setValue("libraries" , JSON.stringify(libraries))

#   global.getLibraries = ()->
#     return JSON.parse getValue("libraries" , "[]")

#   global.getValue = (name, def)->
#     if !localStorage[name] then localStorage[name] = def
#     return localStorage[name]

#   global.setValue = (name, value)->
#     localStorage[name] value



