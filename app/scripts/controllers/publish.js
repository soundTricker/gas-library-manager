(function() {
  'use strict';
  angular.module('LibraryBoxApp').controller('PublishCtrl', [
    '$scope', '$rootScope', 'notify', 'storage', function($scope, $rootScope, notify, storage) {
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
            notify({
              message: result.error.message,
              template: "views/notify.html",
              scope: {
                title: "Got error",
                type: "alert-error"
              }
            });
            $scope.$apply();
          } else {
            item.published = true;
            return storage.addLibrary(item).then(function() {
              $scope.openDialog = false;
              return notify({
                message: "Success Publish Library",
                template: "views/notify.html",
                scope: {
                  title: "Published Library",
                  type: "alert-success"
                }
              });
            });
          }
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
            notify({
              message: result.error.message,
              template: "views/notify.html",
              scope: {
                title: "Got error",
                type: "alert-error"
              }
            });
            return;
          }
          $scope.openModifyDialog = false;
          notify({
            message: "Success Update published library",
            template: "views/notify.html",
            scope: {
              title: "Update published library",
              type: "alert-success"
            }
          });
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
              return notify({
                message: result.error.message,
                template: "views/notify.html",
                scope: {
                  title: "Got error",
                  type: "alert-error"
                }
              });
            });
          } else {
            item.published = false;
            return storage.addLibrary(item).then(function() {
              $scope.openDeleteDialog = false;
              $scope.item.published = false;
              return notify({
                message: "Success Delete published library",
                template: "views/notify.html",
                scope: {
                  title: "Delete published library",
                  type: "alert-success"
                }
              });
            });
          }
        });
      };
    }
  ]);

}).call(this);
