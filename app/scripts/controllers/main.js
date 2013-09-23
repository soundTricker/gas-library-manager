(function() {
  'use strict';
  var libraryBoxApp;

  libraryBoxApp = angular.module('LibraryBoxApp');

  libraryBoxApp.controller('MainCtrl', [
    "$scope", '$rootScope', '$state', '$filter', 'storage', 'notify', function($scope, $rootScope, $state, $filter, storage, notify) {
      var filter, item, libraries;
      $scope.uploading = false;
      $scope.isCollapsed = true;
      $scope.currentPage = 1;
      $scope.maxSize = 3;
      $scope.entryLimit = 20;
      libraries = (function() {
        var _i, _len, _ref, _results;
        _ref = $rootScope.libraries;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (!item.isExternal) {
            _results.push(item);
          }
        }
        return _results;
      })();
      libraries = libraries.sort(function(i1, i2) {
        return i1.label.toLowerCase() > i2.label.toLowerCase();
      });
      filter = function() {
        return $filter('limitTo')($filter('startFrom')($filter('filter')(libraries, $scope.search), ($scope.currentPage - 1) * $scope.entryLimit), $scope.entryLimit);
      };
      $scope.filtered = filter();
      $scope.$watch("search.$", function() {
        return $scope.filtered = filter();
      });
      $scope.$on("deleted", function(event, key) {
        console.log(key);
        libraries = libraries.filter(function(library) {
          return library.key !== key;
        });
        return $scope.filtered = filter();
      });
      $scope.noOfPages = Math.ceil(libraries.length / $scope.entryLimit);
      $scope.setPage = function(pageNo) {
        return $scope.currentPage = pageNo;
      };
      $scope.$watch('filtered', function() {
        return $scope.noOfPages = Math.ceil($scope.filtered.length / $scope.entryLimit);
      });
      $scope.uploadLibraries = function() {
        $scope.uploading = true;
        return storage.getLibraries().then(function(libraries) {
          var boundary, close_delim, delimiter, json, metadata, multipartRequestBody;
          boundary = '-------' + new Date().getTime();
          delimiter = "--" + boundary;
          close_delim = "--" + boundary + "--";
          json = JSON.stringify(libraries, "", 2);
          metadata = {
            'title': "gas-library-box-libraries.json",
            'mimeType': "application/json"
          };
          multipartRequestBody = "" + delimiter + "\nContent-Type: application/json\n\n" + (JSON.stringify(metadata)) + "\n" + delimiter + "\nContent-Type: application/json\nContent-Transfer-Encoding: base64\n\n" + (btoa(json)) + "\n" + close_delim;
          return gapi.client.request({
            'path': '/upload/drive/v2/files',
            'method': 'POST',
            'params': {
              'uploadType': 'multipart'
            },
            'headers': {
              'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody
          }).execute(function(result) {
            return $scope.$apply(function() {
              $scope.uploading = false;
              if (result.error) {
                return notify({
                  message: result.error.message,
                  template: "views/notify.html",
                  scope: {
                    title: "Got Error",
                    type: "alert-error"
                  }
                });
              } else {
                return notify({
                  message: "Exported your libraries to Google Drive.<br/> Please see <a href=\"" + result.alternateLink + "\" target=\"_blank\">Google Drive</a>",
                  template: "views/notify.html",
                  scope: {
                    title: "Exported your libraries",
                    type: "alert-info"
                  }
                });
              }
            });
          });
        });
      };
      return $scope["import"] = function(fileId) {
        $scope.importing = true;
        return gapi.client.drive.files.get({
          "fileId": fileId,
          "fields": "downloadUrl"
        }).execute(function(result) {
          if (result.error) {
            notify({
              message: result.error.message,
              template: "views/notify.html",
              scope: {
                title: "Got Error",
                type: "alert-error"
              }
            });
            return;
          }
          return $.ajax(result.downloadUrl, {
            headers: {
              "Authorization": "Bearer " + (gapi.auth.getToken().access_token)
            }
          }).then(function(result) {
            console.log(result);
            return storage.addLibraries(result).then(function() {
              $scope.isCollapsed = true;
              return storage.getLibraries().then(function(libs) {
                var key;
                libraries = (function() {
                  var _results;
                  _results = [];
                  for (key in libs) {
                    item = libs[key];
                    if (!item.isExternal) {
                      _results.push(item);
                    }
                  }
                  return _results;
                })();
                libraries = libraries.sort(function(i1, i2) {
                  return i1.label.toLowerCase() > i2.label.toLowerCase();
                });
                $scope.filtered = filter();
                return notify({
                  message: "Success importing your libraries",
                  template: "views/notify.html",
                  scope: {
                    title: "Import your libraries",
                    type: "alert-info"
                  }
                });
              });
            });
          });
        });
      };
    }
  ]);

  libraryBoxApp.controller('PrivateLibraryCtrl', [
    "$scope", "$window", 'storage', function($scope, $window, storage) {
      $scope.modify = false;
      $scope["delete"] = false;
      $scope.saving = false;
      $scope.deleteLibrary = function() {
        if ($window.confirm("Are you sure delete " + $scope.item.label + " ?")) {
          return storage.removeLibrary($scope.item.key).then(function() {
            alert("deleted");
            $scope.$parent.$emit("deleted", $scope.item.key);
            return $scope["delete"] = false;
          });
        } else {
          return $scope["delete"] = false;
        }
      };
      return $scope.modifyLibs = function() {
        $scope.saving = true;
        $scope.item.label = $scope.label;
        $scope.item.desc = $scope.desc;
        $scope.item.longDesc = $scope.longDesc;
        $scope.item.modifiedAt = new Date().getTime();
        return storage.addLibrary($scope.item).then(function() {
          $scope.modify = false;
          return $scope.saving = false;
        });
      };
    }
  ]);

}).call(this);
