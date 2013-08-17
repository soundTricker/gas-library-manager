(function() {
  'use strict';
  var __slice = [].slice;

  angular.module('LibraryBoxApp', ['ngSanitize']).config([
    "$routeProvider", function($routeProvider) {
      return $routeProvider.when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      }).otherwise({
        redirectTo: '/'
      });
    }
  ]).run([
    "$rootScope", function($rootScope) {
      return $rootScope.i18n = function() {
        var args, key;
        key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (args.length > 0) {
          return chrome.i18n.getMessage.apply(chrome.i18n, [key].concat(args));
        } else {
          return chrome.i18n.getMessage.apply(chrome.i18n, [key]);
        }
      };
    }
  ]);

}).call(this);
