(function() {
  'use strict';
  angular.module('LibraryBoxApp').controller('RegisterCtrl', [
    '$scope', '$rootScope', '$notify', '$state', function($scope, $rootScope, $notify, $state) {
      var loadInitialData;
      $scope.processing = false;
      $scope.register = function() {
        $scope.processing = true;
        return gapi.client.members.register({
          nickname: $scope.nickname,
          url: $scope.plusResult.url,
          userIconUrl: $scope.useIcon === "use" ? $scope.userIconUrl : ""
        }).execute(function(result) {
          if (result.error) {
            return $notify.error("Got Error", result.error.message);
          }
          $notify.success("Registered your account to gas-library-box", "Registered");
          $rootScope.$broadcast("loggedin", {
            userIconUrl: result.userIconUrl,
            nickname: result.nickname
          });
          $state.go('top');
        });
      };
      loadInitialData = function() {
        if ($rootScope.loggedin) {
          $notify.warn("Warnning", "You are already registered gas-library-box");
          $state.go('top');
          return;
        }
        return gapi.client.plus.people.get({
          userId: "me"
        }).execute(function(result) {
          if (result.error) {
            return $notify.error("Got Error, Please refresh page", result.error.message);
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
