do(global=@)->
  chrome.runtime.onInstalled.addListener (details)-> 
    global.showOptionPage() if details?.reason is "install"

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



