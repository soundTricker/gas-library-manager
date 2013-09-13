'use strict'

@gapiIsLoaded = ()-> window.gapiIsLoaded()

angular.module('LibraryBoxApp', ['ngSanitize','cgNotify','ui.bootstrap', 'ui.directives', 'markdown'])
  .config(["$routeProvider",'$compileProvider', ($routeProvider,$compileProvider) ->
    $compileProvider.urlSanitizationWhitelist /^\s*(https?|ftp|mailto|chrome-extension):/

    $routeProvider
      .when '/',
        templateUrl: 'views/index.html'
        controller: 'IndexCtrl'
      .when '/mine',
        templateUrl: 'views/main.html'
        controller: 'MainCtrl'
      .when '/mine/:key',
        templateUrl: 'views/detail.html'
        controller: 'DetailCtrl'
        resolve :
          'library' : ['$route','$rootScope', '$q',($route, $rootScope, $q)->
            return $rootScope.libraryMap[$route.current.params.key] if $rootScope.libraryMap
            d = $q.defer()
            $rootScope.$on 'loadedLibraries', ()->
              d.resolve $rootScope.libraryMap[$route.current.params.key]
            d.promise
          ]
          'type' : ()->'mine'
      .when '/global/:key',
        templateUrl: 'views/globalDetail.html'
        controller: 'DetailCtrl'
        resolve:
          'library' : ['$route', '$rootScope', '$q',($route,$rootScope, $q)->
            d = $q.defer()
            get = do(key=$route.current.params.key)->
              return ()->
                gapi.client.libraries.get(key : key).execute (result)->
                  d.resolve result
                  $rootScope.$apply()
                d.promise
            return get() if $rootScope.gapiLoaded
              
            $rootScope.$on "gapiLoaded", ()->
              get()
            d.promise
          ]
          'type' : ()-> "global"
      .when '/global',
        templateUrl: 'views/global.html'
        controller: 'GlobalCtrl'
        resolve : 
          'libraries' : ['$route','$rootScope','$q', ($route, $rootScope, $q)->

            d = $q.defer()

            search = ()->
              param = query : $route.current.params.q
              param.next = parseInt $route.current.params.next if $route.current.params.next
              gapi.client.libraries.search(param).execute (result)->
                console.log result
                d.resolve result.items ? []
                $rootScope.$apply()
              d.promise

            list = ()->
              gapi.client.libraries.list().execute (result)-> 
                $rootScope.globalLibraries = result.items
                d.resolve result.items ? []
                $rootScope.$apply()
              d.promise

            return $rootScope.globalLibraries if $rootScope.globalLibraries

            if $rootScope.gapiLoaded
              return search() if $route.current.params.q
              return list()

            $rootScope.$on "gapiLoaded", ()->
              return search() if $route.current.params.q
              return list()
            d.promise
          ]

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
    chrome.storage.onChanged.addListener (changes, areaName)->
      return if areaName != "sync"
      $rootScope.libraryMap = changes.libraries.newValue
      $rootScope.libraries = (item for key, item of (changes?.libraries?.newValue || {}) when item.key)
      $rootScope.$apply()

    chrome.storage.sync.get "libraries" , (res)->
      $rootScope.libraryMap = res.libraries
      $rootScope.libraries = (item for key, item of (res?.libraries || {}) when item.key)
      $rootScope.$broadcast 'loadedLibraries'
      $rootScope.$apply()

  ]