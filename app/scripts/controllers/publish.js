(function() {
  'use strict';
  angular.module('LibraryBoxApp').controller('PublishCtrl', [
    '$scope', '$rootScope', '$notify', 'storage', function($scope, $rootScope, $notify, storage) {
      $scope.opts = {
        backdropFade: true,
        dialogFade: true
      };
      $scope.publish = function() {
        var item, loginUser;
        item = $scope.item;
        loginUser = $rootScope.loginUser;
        return gapi.client.libraries.insert({
          libraryKey: item.key,
          label: item.label,
          desc: item.desc,
          longDesc: item.longDesc,
          sourceUrl: item.sourceUrl,
          authorName: loginUser.nickname,
          authorUrl: loginUser.url,
          authorKey: loginUser.key
        }).execute(function(result) {
          if (result.error) {
            if (result.error.code === 409) {
              item.published = true;
              storage.addLibrary(item);
            }
            $scope.openDialog = false;
            $notify.error("Got error", result.error.message);
            $scope.$apply();
            return;
          }
          item.published = true;
          return storage.addLibrary(item).then(function() {
            $scope.openDialog = false;
            return $notify.success("Success publishing library", "" + item.label + " is plublished");
          });
        });
      };
      $scope.update = function() {
        var item, loginUser;
        item = $scope.item;
        loginUser = $rootScope.loginUser;
        return gapi.client.libraries.put({
          libraryKey: item.key,
          label: item.label,
          desc: item.desc,
          longDesc: item.longDesc,
          sourceUrl: item.sourceUrl,
          authorName: loginUser.nickname,
          authorUrl: loginUser.url,
          authorKey: loginUser.key
        }).execute(function(result) {
          if (result.error) {
            if (result.error.code === 404) {
              item.published = false;
              storage.addLibrary(item);
            }
            $scope.openModifyDialog = false;
            $notify.error("Got error", result.error.message);
            return;
          }
          $scope.openModifyDialog = false;
          $notify.success("Success updating library", "" + item.label + " is updated");
          return $scope.$apply();
        });
      };
      return $scope["delete"] = function() {
        var item;
        item = $scope.item;
        return gapi.client.libraries["delete"]({
          libraryKey: item.key
        }).execute(function(result) {
          if (result.error) {
            if (result.error.code === 404) {
              item.published = false;
              storage.addLibrary(item);
            }
            return $scope.$apply(function() {
              $scope.openDeleteDialog = false;
              return $notify.error("Got error", result.error.message);
            });
          } else {
            item.published = false;
            return storage.addLibrary(item).then(function() {
              $scope.openDeleteDialog = false;
              $scope.item.published = false;
              return $notify.success("Success deleting published library", "" + item.label + " is deleted");
            });
          }
        });
      };
    }
  ]);

}).call(this);
