'use strict'

@gapiIsLoaded = ()-> window.gapiIsLoaded()

angular.module('LibraryBoxApp', ['ngSanitize','cgNotify'])
  .config(["$routeProvider", ($routeProvider) ->
    $routeProvider
      .when '/',
        templateUrl: 'views/main.html'
        controller: 'MainCtrl'
      .when '/register',
        templateUrl: 'views/register.html'
        controller: 'RegisterCtrl'
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