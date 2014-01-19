(function() {
  'use strict';
  var __slice = [].slice;

  this.gapiIsLoaded = function() {
    return window.gapiIsLoaded();
  };

  angular.module('LibraryBoxApp', ['ngSanitize', 'cgNotify', 'ui.bootstrap', 'ui.directives', 'ui.router', 'markdown']).constant("apiUrl", "https://gas-library-box.appspot.com/_ah/api").config([
    "$stateProvider", "$urlRouterProvider", '$compileProvider', function($stateProvider, $urlRouterProvider, $compileProvider) {
      $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
      $urlRouterProvider.otherwise('/');
      return $stateProvider.state('top', {
        url: '/',
        views: {
          container: {
            templateUrl: 'views/index.html',
            controller: 'IndexCtrl'
          }
        }
      }).state('mine', {
        url: '/mine',
        views: {
          container: {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
          }
        }
      }).state('mine.detail', {
        url: '/detail/:key',
        views: {
          mine: {
            templateUrl: 'views/detail.html',
            controller: 'DetailCtrl'
          }
        },
        resolve: {
          'library': [
            '$stateParams', 'storage', function($stateParams, storage) {
              return storage.getLibrary($stateParams.key);
            }
          ]
        }
      });
    }
  ]).run([
    "$rootScope", 'storage', function($rootScope, storage) {
      $rootScope.i18n = function() {
        var args, key;
        key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (args.length > 0) {
          return chrome.i18n.getMessage.apply(chrome.i18n, [key].concat(args));
        } else {
          return chrome.i18n.getMessage.apply(chrome.i18n, [key]);
        }
      };
      $rootScope.$on('addLibrary', function(result) {
        var item, key;
        $rootScope.libraryMap = result.changes.libraries.newValue;
        $rootScope.libraries = (function() {
          var _ref, _ref1, _ref2, _results;
          _ref2 = ((_ref = result.changes) != null ? (_ref1 = _ref.libraries) != null ? _ref1.newValue : void 0 : void 0) || {};
          _results = [];
          for (key in _ref2) {
            item = _ref2[key];
            if (item.key) {
              _results.push(item);
            }
          }
          return _results;
        })();
        return $rootScope.$apply();
      });
      return storage.getLibraries().then(function(libraries) {
        var item, key;
        $rootScope.libraryMap = libraries;
        $rootScope.libraries = (function() {
          var _ref, _results;
          _ref = libraries || {};
          _results = [];
          for (key in _ref) {
            item = _ref[key];
            if (item.key) {
              _results.push(item);
            }
          }
          return _results;
        })();
        return $rootScope.$broadcast('loadedLibraries');
      });
    }
  ]);

}).call(this);
