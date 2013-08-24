(function() {
  'use strict';
  angular.module('LibraryBoxApp').controller('optionPageCtrl', [
    '$scope', '$window', '$q', 'notify', '$location', (function($scope, $window, $q, notify, $location) {
      $window.gapiIsLoaded = function() {
        return gapi.auth.init(function() {
          var loadApiDefer;
          loadApiDefer = function(api, version, base) {
            var d;
            d = $q.defer();
            if (base) {
              gapi.client.load(api, version, (function() {
                return $scope.$apply(function() {
                  return d.resolve(api);
                });
              }), base);
            } else {
              gapi.client.load(api, version, (function() {
                return $scope.$apply(function() {
                  return d.resolve(api);
                });
              }));
            }
            return d.promise;
          };
          return $q.when([loadApiDefer("plus", "v1"), loadApiDefer("libraries", "v1", "https://gas-library-box.appspot.com/_ah/api"), loadApiDefer("members", "v1", "https://gas-library-box.appspot.com/_ah/api")]).then(function() {
            return $scope.loginStatus = "loadFinished";
          });
        });
      };
      $scope.login = function() {
        $scope.loginStatus = "";
        return chrome.identity.getAuthToken({
          interactive: true
        }, function(token) {
          gapi.auth.setToken({
            "access_token": token
          });
          return gapi.client.members.get({
            userKey: "me"
          }).execute(function(result) {
            if (result.code === 404) {
              notify("Please Sign Up", "You are not registered to gas-library-box service. If you want to publish your library to gas-library-box , please sign up.");
              $scope.loginStatus = "givenRegister";
              $scope.$apply();
            }
          });
        });
      };
      return $scope.showRegister = function() {
        return $location.path("/register");
      };
    })
  ]);

}).call(this);
