(function() {
  'use strict';
  angular.module('LibraryBoxApp').controller('optionPageCtrl', [
    '$scope', '$state', '$rootScope', '$window', '$q', '$notify', 'storage', 'apiUrl', '$analytics', '$location', (function($scope, $state, $rootScope, $window, $q, $notify, storage, apiUrl, $analytics, $location) {
      $rootScope.$state = $state;
      $rootScope.$on("$stateChangeStart", function() {
        return $rootScope.isViewLoading = true;
      });
      $rootScope.$on("$stateChangeSuccess", function() {
        var url;
        if ($state.is('mine.detail')) {
          url = $analytics.settings.pageTracking.basePath + "/mine/" + $state.current.url;
          $analytics.pageTrack(url);
        } else {
          url = $analytics.settings.pageTracking.basePath + $location.url();
          $analytics.pageTrack(url);
        }
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
          return $scope.$apply(function() {
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
            return $q.all([loadApiDefer("drive", "v2"), loadApiDefer("oauth2", "v1")]).then(function() {
              return $scope.authorize(false);
            });
          });
        });
      };
      $scope.authorize = function(interactive) {
        return chrome.identity.getAuthToken({
          interactive: interactive
        }, function(token) {
          if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError);
            $rootScope.loginStatus = "notAuthorized";
            $notify.info("Please authorize App", "You have not authorized this app, In this state, GLM is limited.");
            return $scope.$apply();
          }
          if (token == null) {
            $rootScope.loginStatus = "notAuthorized";
            $notify.info("Please authorize App", "You have not authorized this app, In this state, GLM is limited.");
            return $scope.$apply();
          }
          gapi.client.oauth2.tokeninfo({
            access_token: token
          }).execute(function(result) {
            if (result.error) {
              gapi.auth.setToken({
                access_token: ""
              });
              return chrome.identity.removeCachedAuthToken({
                token: token
              }, function() {
                $rootScope.loginStatus = "notAuthorized";
                $notify.info("Please authorize App", "You have not authorized this app, In this state, GLM is limited.");
                return $scope.$apply();
              });
            }
          });
          gapi.auth.setToken({
            access_token: token
          });
          $rootScope.loginStatus = "loaded";
          $rootScope.gapiLoaded = true;
          $rootScope.$emit('gapiLoaded');
          return $scope.$apply();
        });
      };
      return $scope.showRegister = function() {
        return $state.go("register");
      };
    })
  ]);

}).call(this);
