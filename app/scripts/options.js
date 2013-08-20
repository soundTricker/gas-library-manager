(function() {
  'use strict';
  var authorize,
    __slice = [].slice;

  authorize = function(params, callback) {
    console.log("hoge2");
    return gapi.auth.authorize(params, function(accessToken) {
      console.log("hoge");
      return window.accessToken = accessToken;
    });
  };

  window.gapiIsLoaded = function() {
    var host, popup, url;
    host = location.host;
    url = "https://accounts.google.com/o/oauth2/auth  ?client_id=664413555370.apps.googleusercontent.com  &redirect_uri=https://gas-library-box.appspot.com/oauthcallback.html  &scope=https://www.googleapis.com/auth/plus.login   https://www.googleapis.com/auth/plus.me   https://www.googleapis.com/auth/userinfo.email   https://www.googleapis.com/auth/userinfo.profile  &responce_type=token  &state=" + host;
    popup = shindig.oauth.popup({
      destination: url,
      windowOptions: "width=640,height=480",
      onOpen: function() {
        return this;
      },
      onClose: function() {
        return this;
      }
    });
    popup.createOpenerOnClick();
    console.log("popup");
    return window.popup = popup;
  };

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
