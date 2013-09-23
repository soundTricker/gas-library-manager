(function() {
  'use strict';
  angular.module('LibraryBoxApp').controller('RegisterCtrl', [
    '$scope', '$rootScope', 'notify', '$location', function($scope, $rootScope, notify, $location) {
      var loadInitialData;
      $scope.register = function() {
        return gapi.client.members.register({
          nickname: $scope.nickname,
          url: $scope.plusResult.url,
          userIconUrl: $scope.useIcon === "use" ? $scope.userIconUrl : ""
        }).execute(function(result) {
          console.log(result);
          if (result.error) {
            return;
          }
          notify({
            message: "Registered",
            template: "views/notify.html",
            scope: {
              title: "Registered your account to gas-library-box",
              type: "alert-success"
            }
          });
          $rootScope.$broadcast("loggedin", {
            userIconUrl: result.userIconUrl,
            nickname: result.nickname
          });
          $location.path('/');
        });
      };
      loadInitialData = function() {
        if ($rootScope.loggedin) {
          notify({
            message: "You are already registered gas-library-box",
            template: "views/notify.html",
            scope: {
              title: "Warnning",
              type: "alert-warnning"
            }
          });
          $location.path('/');
          return;
        }
        return gapi.client.plus.people.get({
          userId: "me"
        }).execute(function(result) {
          if (result.error) {
            return notify({
              message: result.error.message,
              template: "views/notify.html",
              scope: {
                title: "Got Error, Please reflesh page",
                type: "alert-error"
              }
            });
          }
          $scope.plusResult = result;
          $scope.nickname = result.nickname;
          $scope.userIconUrl = result.image.url;
          $scope.loaded = true;
          return $scope.$apply();
        });
      };
      if ($rootScope.gapiLoaded) {
        return loadInitialData();
      } else {
        return $scope.$on('gapiLoaded', loadInitialData);
      }
    }
  ]);

}).call(this);
