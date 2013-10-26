(function() {
  'use strict';
  angular.module('LibraryBoxApp').controller('ModifyAccountCtrl', [
    '$scope', '$rootScope', '$notify', '$state', '$q', function($scope, $rootScope, $notify, $state, $q) {
      var loadInitialData;
      $scope.processing = false;
      $scope.modify = function() {
        return gapi.client.members.put({
          nickname: $scope.nickname,
          url: $scope.result.url,
          userIconUrl: $scope.useIcon === "use" ? $scope.userIconUrl : ""
        }).execute(function(result) {
          if (result.error) {
            return $notify.error("Got Error", result.error.message);
          }
          $notify.success("Update your account", "Updated");
          $rootScope.$broadcast("loggedin", {
            userIconUrl: result.userIconUrl,
            nickname: result.nickname
          });
          $scope.processing = false;
          return $state.go('top');
        });
      };
      loadInitialData = function() {
        var members, people;
        if (!$rootScope.loggedin) {
          $notify.warn("Warnning", "You are not registered gas-library-box, Please register account");
          $state.go('register');
          return;
        }
        people = function() {
          var d;
          d = $q.defer();
          gapi.client.plus.people.get({
            userId: "me"
          }).execute(function(result) {
            return $scope.$apply(function() {
              return d.resolve(result);
            });
          });
          return d.promise;
        };
        members = function() {
          var d;
          d = $q.defer();
          gapi.client.members.get({
            userKey: "me"
          }).execute(function(result) {
            return $scope.$apply(function() {
              return d.resolve(result);
            });
          });
          return d.promise;
        };
        return $q.all([people(), members()]).then(function(results) {
          var me, _ref;
          people = results[0];
          me = results[1];
          if (people.error || me.error) {
            return $notify.error("Got Error, Please reflesh page", ((_ref = people.error) != null ? _ref.message : void 0) || me.error.message);
          }
          $scope.result = me;
          $scope.nickname = me.nickname;
          $scope.userIconUrl = people.image.url;
          return $scope.loaded = true;
        });
      };
      if ($rootScope.gapiLoaded) {
        return loadInitialData();
      } else {
        return $rootScope.$on('gapiLoaded', loadInitialData);
      }
    }
  ]);

}).call(this);
