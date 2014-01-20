do(global=@)->
  chrome.runtime.onInstalled.addListener (prev)-> global.showOptionPage()

  chrome.extension.onMessage.addListener (message, sender, sendResponse)->
    console.log message, sender, sendResponse
    result = (global[message.action] || ()-> "no command").apply global, [message]
    sendResponse && sendResponse values : result

  global.showOptionPage = ()-> 
    chrome.tabs.create url : chrome.extension.getURL("options.html")
  global.showMyLibraryPage = (message)-> 
    console.log arguments
    chrome.tabs.create url : "${chrome.extension.getURL('options.html')}#/mine/detail/#{message.key}"

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



