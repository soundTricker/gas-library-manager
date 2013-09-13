(function() {
  'use strict';
  var __slice = [].slice;

  this.gapiIsLoaded = function() {
    return window.gapiIsLoaded();
  };

  angular.module('LibraryBoxApp', ['ngSanitize', 'cgNotify', 'ui.bootstrap', 'ui.directives', 'markdown']).config([
    "$routeProvider", '$compileProvider', function($routeProvider, $compileProvider) {
      $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
      return $routeProvider.when('/', {
        templateUrl: 'views/index.html',
        controller: 'IndexCtrl'
      }).when('/mine', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      }).when('/mine/:key', {
        templateUrl: 'views/detail.html',
        controller: 'DetailCtrl',
        resolve: {
          'library': [
            '$route', '$rootScope', '$q', function($route, $rootScope, $q) {
              var d;
              if ($rootScope.libraryMap) {
                return $rootScope.libraryMap[$route.current.params.key];
              }
              d = $q.defer();
              $rootScope.$on('loadedLibraries', function() {
                return d.resolve($rootScope.libraryMap[$route.current.params.key]);
              });
              return d.promise;
            }
          ],
          'type': function() {
            return 'mine';
          }
        }
      }).when('/global/:key', {
        templateUrl: 'views/globalDetail.html',
        controller: 'DetailCtrl',
        resolve: {
          'library': [
            '$route', '$rootScope', '$q', function($route, $rootScope, $q) {
              var d, get;
              d = $q.defer();
              get = (function(key) {
                return function() {
                  gapi.client.libraries.get({
                    key: key
                  }).execute(function(result) {
                    d.resolve(result);
                    return $rootScope.$apply();
                  });
                  return d.promise;
                };
              })($route.current.params.key);
              if ($rootScope.gapiLoaded) {
                return get();
              }
              $rootScope.$on("gapiLoaded", function() {
                return get();
              });
              return d.promise;
            }
          ],
          'type': function() {
            return "global";
          }
        }
      }).when('/global', {
        templateUrl: 'views/global.html',
        controller: 'GlobalCtrl',
        resolve: {
          'libraries': [
            '$route', '$rootScope', '$q', function($route, $rootScope, $q) {
              var d, list, search;
              d = $q.defer();
              search = function() {
                var param;
                param = {
                  query: $route.current.params.q
                };
                if ($route.current.params.next) {
                  param.next = parseInt($route.current.params.next);
                }
                gapi.client.libraries.search(param).execute(function(result) {
                  var _ref;
                  console.log(result);
                  d.resolve((_ref = result.items) != null ? _ref : []);
                  return $rootScope.$apply();
                });
                return d.promise;
              };
              list = function() {
                gapi.client.libraries.list().execute(function(result) {
                  var _ref;
                  $rootScope.globalLibraries = result.items;
                  d.resolve((_ref = result.items) != null ? _ref : []);
                  return $rootScope.$apply();
                });
                return d.promise;
              };
              if ($rootScope.globalLibraries) {
                return $rootScope.globalLibraries;
              }
              if ($rootScope.gapiLoaded) {
                if ($route.current.params.q) {
                  return search();
                }
                return list();
              }
              $rootScope.$on("gapiLoaded", function() {
                if ($route.current.params.q) {
                  return search();
                }
                return list();
              });
              return d.promise;
            }
          ]
        }
      }).when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      }).otherwise({
        redirectTo: '/'
      });
    }
  ]).run([
    "$rootScope", function($rootScope) {
      $rootScope.i18n = function() {
        var args, key;
        key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (args.length > 0) {
          return chrome.i18n.getMessage.apply(chrome.i18n, [key].concat(args));
        } else {
          return chrome.i18n.getMessage.apply(chrome.i18n, [key]);
        }
      };
      chrome.storage.onChanged.addListener(function(changes, areaName) {
        var item, key;
        if (areaName !== "sync") {
          return;
        }
        $rootScope.libraryMap = changes.libraries.newValue;
        $rootScope.libraries = (function() {
          var _ref, _ref1, _results;
          _ref1 = (changes != null ? (_ref = changes.libraries) != null ? _ref.newValue : void 0 : void 0) || {};
          _results = [];
          for (key in _ref1) {
            item = _ref1[key];
            if (item.key) {
              _results.push(item);
            }
          }
          return _results;
        })();
        return $rootScope.$apply();
      });
      return chrome.storage.sync.get("libraries", function(res) {
        var item, key;
        $rootScope.libraryMap = res.libraries;
        $rootScope.libraries = (function() {
          var _ref, _results;
          _ref = (res != null ? res.libraries : void 0) || {};
          _results = [];
          for (key in _ref) {
            item = _ref[key];
            if (item.key) {
              _results.push(item);
            }
          }
          return _results;
        })();
        $rootScope.$broadcast('loadedLibraries');
        return $rootScope.$apply();
      });
    }
  ]);

}).call(this);
