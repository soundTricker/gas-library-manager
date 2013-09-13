(function() {
  'use strict';
  angular.module('LibraryBoxApp').controller('optionPageCtrl', [
    '$scope', '$rootScope', '$window', '$q', 'notify', '$location', (function($scope, $rootScope, $window, $q, notify, $location) {
      $rootScope.$on("$routeChangeStart", function() {
        return $rootScope.isViewLoading = true;
      });
      $rootScope.$on("$routeChangeSuccess", function() {
        return $rootScope.isViewLoading = false;
      });
      $rootScope.$on("$routeChangeError", function() {
        return $rootScope.isViewLoading = false;
      });
      $rootScope.$on("loggedin", function(e, info) {
        info.userIconUrl = info.userIconUrl || "";
        $scope.loginStatus = "loggedin";
        $scope.userIconUrl = info.userIconUrl.replace(/\?sz=\d+/, "?sz=30");
        $scope.nickname = info.nickname;
        return $scope.$apply();
      });
      $window.gapiIsLoaded = function() {
        return gapi.auth.init(function() {
          var loadApiDefer;
          loadApiDefer = function(api, version, base) {
            var d;
            d = $q.defer();
            if (base) {
              gapi.client.load(api, version, (function(e) {
                return $scope.$apply(function() {
                  return d.resolve(api);
                });
              }), base);
            } else {
              gapi.client.load(api, version, function(e) {
                return $scope.$apply(function() {
                  return d.resolve(api);
                });
              });
            }
            return d.promise;
          };
          return $q.all([loadApiDefer("plus", "v1"), loadApiDefer("libraries", "v1", "https://gas-library-box.appspot.com/_ah/api"), loadApiDefer("members", "v1", "https://gas-library-box.appspot.com/_ah/api")]).then(function() {
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
                  notify({
                    message: "You are not registered to gas-library-box service.<br> If you want to publish your library to gas-library-box , please sign up.",
                    template: "views/notify.html",
                    scope: {
                      title: "Please Sign Up",
                      type: "alert-info"
                    }
                  });
                  $scope.loginStatus = "givenRegister";
                } else {
                  $rootScope.loginUser = result;
                  $rootScope.$broadcast("loggedin", result);
                }
                $rootScope.loggedin = result.code !== 404;
                $rootScope.gapiLoaded = true;
                $rootScope.$broadcast('gapiLoaded');
                return $scope.$apply();
              });
            });
          });
        });
      };
      return $scope.showRegister = function() {
        return $location.path("/register");
      };
    })
  ]);

}).call(this);
