(function() {
  'use strict';
  angular.module('LibraryBoxApp').controller('PublishCtrl', [
    '$scope', '$rootScope', '$q', 'notify', function($scope, $rootScope, $q, notify) {
      $scope.opts = {
        backdropFade: true,
        dialogFade: true
      };
      $scope.isPublishedLibrary = function(key) {
        var d, _ref;
        if ($rootScope.libraryMap) {
          return (_ref = $rootScope.libraryMap[key]) != null ? _ref.published : void 0;
        }
        d = $q.defer();
        $rootScope.$on('loadedLibraries', function() {
          var _ref1;
          return d.resolve((_ref1 = $rootScope.libraryMap[key]) != null ? _ref1.published : void 0);
        });
        return d.promise;
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
          console.log(result);
          if (result.error) {
            if (result.error.code === 409) {
              chrome.storage.sync.get("libraries", function(res) {
                var libraries;
                libraries = (res != null ? res.libraries : void 0) || {};
                item.published = true;
                libraries[item.key] = item;
                return chrome.storage.sync.set({
                  "libraries": libraries
                });
              });
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
            return chrome.storage.sync.get("libraries", function(res) {
              var libraries;
              libraries = (res != null ? res.libraries : void 0) || {};
              item.published = true;
              libraries[item.key] = item;
              return chrome.storage.sync.set({
                "libraries": libraries
              }, function() {
                return $scope.$apply(function() {
                  $scope.openDialog = false;
                  notify({
                    message: "Success Publish Library",
                    template: "views/notify.html",
                    scope: {
                      title: "Published Library",
                      type: "alert-success"
                    }
                  });
                });
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
          console.log(result);
          if (result.error) {
            if (result.error.code === 404) {
              chrome.storage.sync.get("libraries", function(res) {
                var libraries;
                libraries = (res != null ? res.libraries : void 0) || {};
                item.published = false;
                libraries[item.key] = item;
                return chrome.storage.sync.set({
                  "libraries": libraries
                });
              });
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
          } else {
            $scope.openModifyDialog = false;
            notify({
              message: "Success Update published library",
              template: "views/notify.html",
              scope: {
                title: "Update published library",
                type: "alert-success"
              }
            });
          }
          return $scope.$apply();
        });
      };
      return $scope["delete"] = function() {
        var item;
        item = $scope.item;
        return gapi.client.libraries["delete"]({
          libraryKey: item.key
        }).execute(function(result) {
          console.log(result);
          if (result.error) {
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
            return chrome.storage.sync.get("libraries", function(res) {
              var libraries;
              libraries = (res != null ? res.libraries : void 0) || {};
              item.published = false;
              libraries[item.key] = item;
              return chrome.storage.sync.set({
                "libraries": libraries
              }, function() {
                return $scope.$apply(function() {
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
              });
            });
          }
        });
      };
    }
  ]);

}).call(this);
