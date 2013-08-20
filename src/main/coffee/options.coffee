'use strict'

authorize = (params, callback)->
  console.log "hoge2"
  gapi.auth.authorize params, (accessToken)->
    console.log "hoge"
    window.accessToken = accessToken

window.gapiIsLoaded = ()->
  # params = { 'immediate': false };
  # if !(chrome && chrome.app && chrome.app.runtime)
  #   # This part of the sample assumes that the code is run as a web page, and
  #   # not an actual Chrome application, which means it takes advantage of the
  #   # GAPI lib loaded from https://apis.google.com/. The client used below
  #   # should be working on http://localhost:8000 to avoid origin_mismatch error
  #   # when making the authorize calls.
  #   params.scope = "https://www.googleapis.com/auth/plus.login 
  #   https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/userinfo.email 
  #   https://www.googleapis.com/auth/userinfo.profile"
  #   params.client_id = "664413555370.apps.googleusercontent.com"
  #   gapi.auth.init(authorize.bind(null, params, null));
  # else
  #   authorize(params, null);
  host = location.host
  url = "https://accounts.google.com/o/oauth2/auth
  ?client_id=664413555370.apps.googleusercontent.com
  &redirect_uri=https://gas-library-box.appspot.com/oauthcallback.html
  &scope=https://www.googleapis.com/auth/plus.login 
  https://www.googleapis.com/auth/plus.me 
  https://www.googleapis.com/auth/userinfo.email 
  https://www.googleapis.com/auth/userinfo.profile
  &responce_type=token
  &state=#{host}"

  popup = shindig.oauth.popup(
    destination: url,
    windowOptions: "width=640,height=480",
    onOpen: ()->@,
    onClose: ()->@
  )
  popup.createOpenerOnClick()
  console.log "popup"
  window.popup = popup

angular.module('LibraryBoxApp', ['ngSanitize'])
  .config(["$routeProvider", ($routeProvider) ->
    $routeProvider
      .when '/',
        templateUrl: 'views/main.html'
        controller: 'MainCtrl'
      .otherwise
        redirectTo: '/'
  ])
  .run ["$rootScope", ($rootScope)->
    $rootScope.i18n = (key, args...)->
      if args.length > 0
        chrome.i18n.getMessage.apply chrome.i18n, [key].concat(args)
      else
        chrome.i18n.getMessage.apply chrome.i18n, [key]
  ]