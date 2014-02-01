'use strict'

@gapiIsLoaded = ()-> window.gapiIsLoaded()

angular
  .module('LibraryBoxApp', ['ngSanitize','cgNotify','ui.bootstrap', 'ui.directives','ui.router', 'markdown'])
  .constant("apiUrl", "https://gas-library-box.appspot.com/_ah/api")
  .config(["$stateProvider","$urlRouterProvider",'$compileProvider', ($stateProvider,$urlRouterProvider,$compileProvider) ->
    $compileProvider.urlSanitizationWhitelist /^\s*(https?|ftp|mailto|chrome-extension):/

    $urlRouterProvider.otherwise '/'

    $stateProvider
      .state 'top',
        url: '/'
        views :
          container : 
            templateUrl : 'views/index.html'
            controller: 'IndexCtrl'
      .state 'mine', 
        url: '/mine'
        views :
          container : 
            templateUrl : 'views/main.html'
            controller: 'MainCtrl'
      .state 'mine.detail',
        url: '/detail/:key'
        views :
          mine : 
            templateUrl : 'views/detail.html'
            controller: 'DetailCtrl'
        resolve :
          'library' : ['$stateParams', 'storage',($stateParams, storage)-> storage.getLibrary $stateParams.key]
      # .state 'global',
      #   url: '/global?q&next'
      #   templateUrl: 'views/global.html'
      #   controller: 'GlobalCtrl'
      #   resolve : 
      #     'result' : ['$stateParams','$rootScope','$q', ($stateParams, $rootScope, $q)->
      #       d = $q.defer()

      #       search = ()->
      #         param =
      #           query : $stateParams.q,
      #         $stateParams.next || param.nextToken = $stateParams.next
      #         gapi.client.libraries.search(param).execute (result)->
      #           d.resolve result
      #           $rootScope.$apply()
      #         d.promise

      #       list = ()->
      #         param = {}
      #         $stateParams.next || param.cursor = $stateParams.next
      #         gapi.client.libraries.list(param).execute (result)-> 
      #           d.resolve result
      #           $rootScope.$apply()
      #         d.promise

      #       if $rootScope.gapiLoaded
      #         return search() if $stateParams.q
      #         return list()

      #       $rootScope.$on "gapiLoaded", ()->
      #         return search() if $stateParams.q
      #         return list()
      #       d.promise
      #     ]
      # .state 'global.detail',
      #   url: '/detail/:key'
      #   templateUrl: 'views/globalDetail.html'
      #   controller: 'DetailCtrl'
      #   resolve:
      #     'library' : ['$stateParams', '$rootScope', '$q',($stateParams,$rootScope, $q)->
      #       d = $q.defer()
      #       get = do(key=$stateParams.key)->
      #         return ()->
      #           gapi.client.libraries.get(libraryKey : key).execute (result)->
      #             d.resolve result
      #             $rootScope.$apply()
      #           d.promise
      #       return get() if $rootScope.gapiLoaded
              
      #       $rootScope.$on "gapiLoaded", ()->
      #         get()
      #       d.promise
      #     ]
      # .state 'account',
      #   url: '/account',
      #   templateUrl: 'views/modifyAccount.html'
      #   controller: 'ModifyAccountCtrl'
      # .state 'register',
      #   url: '/register',
      #   templateUrl: 'views/register.html'
      #   controller: 'RegisterCtrl'
  ])
  .run ["$rootScope",'storage', ($rootScope, storage)->
    $rootScope.i18n = (key, args...)->
      if args.length > 0
        chrome.i18n.getMessage.apply chrome.i18n, [key].concat(args)
      else
        chrome.i18n.getMessage.apply chrome.i18n, [key]
    $rootScope.$on 'addLibrary', (result)->
      $rootScope.libraryMap = result.changes.libraries.newValue
      $rootScope.libraries = (item for key, item of (result.changes?.libraries?.newValue || {}) when item.key)
      $rootScope.$apply()

    storage.getLibraries().then (libraries)->
      $rootScope.libraryMap = libraries
      $rootScope.libraries = (item for key, item of (libraries || {}) when item.key)
      $rootScope.$broadcast 'loadedLibraries'

  ]
