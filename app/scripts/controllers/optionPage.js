(function() {
  'use strict';
  angular.module('LibraryBoxApp').controller('optionPageCtrl', [
    '$scope', '$state', '$rootScope', '$window', '$q', '$notify', 'storage', 'apiUrl', (function($scope, $state, $rootScope, $window, $q, $notify, storage, apiUrl) {
      $rootScope.$state = $state;
      $rootScope.$on("$stateChangeStart", function() {
        return $rootScope.isViewLoading = true;
      });
      $rootScope.$on("$stateChangeSuccess", function() {
        return $rootScope.isViewLoading = false;
      });
      $rootScope.$on("$stateChangeError", function() {
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
          return $q.all([loadApiDefer("plus", "v1"), loadApiDefer("drive", "v2"), loadApiDefer("libraries", "v1", apiUrl), loadApiDefer("members", "v1", apiUrl)]).then(function() {
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
                  $notify.info("Please Sign Up", "You are not registered to gas-library-box service.<br> If you want to publish your library to gas-library-box , please sign up.");
                  $scope.loginStatus = "givenRegister";
                } else {
                  $rootScope.loginUser = result;
                  $rootScope.$emit("loggedin", result);
                }
                $rootScope.loggedin = result.code !== 404;
                $rootScope.gapiLoaded = true;
                $rootScope.$emit('gapiLoaded');
                console.log(result);
                return $scope.$apply();
              });
            });
          });
        });
      };
      return $scope.showRegister = function() {
        return $state.go("register");
      };
    })
  ]);

}).call(this);
