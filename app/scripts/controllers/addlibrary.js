(function() {
  'use strict';
  var DEFAULT_API_PARAMETER;

  DEFAULT_API_PARAMETER = {
    q: "mimeType = 'application/vnd.google-apps.script'",
    fields: "items(createdDate,defaultOpenWithLink,description,exportLinks,iconLink,id,lastModifyingUser,modifiedDate,originalFilename,owners,properties,selfLink,title,webContentLink,webViewLink),nextPageToken"
  };

  angular.module('LibraryBoxApp').controller('AddLibraryCtrl', [
    '$scope', 'storage', '$notify', '$state', '$window', function($scope, storage, $notify, $state, $window) {
      var libraries;
      $scope.loadFiles = false;
      $scope.opts = {
        backdropFade: true,
        dialogFade: true,
        dialogClass: "modal file-choose-modal"
      };
      libraries = storage.getLibrariesMapSync();
      $scope.isNotLibraryExist = function() {
        if (!$scope.addLibraryForm.libraryKey.$viewValue) {
          return true;
        }
        return libraries[$scope.addLibraryForm.libraryKey.$viewValue] == null;
      };
      $scope.addLibrary = function(library) {
        var item;
        $scope.saving = true;
        item = {
          key: $scope.libraryKey,
          label: $scope.label,
          desc: $scope.desc,
          longDesc: $scope.longDesc,
          sourceUrl: $scope.sourceUrl,
          registeredAt: new Date().getTime(),
          modifiedAt: new Date().getTime()
        };
        if (!$scope.isNotLibraryExist(item.key)) {
          return;
        }
        return storage.addLibrary(item).then(function() {
          $notify.info("Add Library", "" + $scope.label + " have been added");
          $scope.saving = false;
          return $state.go('mine');
        });
      };
      $scope.showPicker = function() {
        $scope.loadFiles = true;
        return gapi.client.drive.files.list(DEFAULT_API_PARAMETER).execute(function(result) {
          if (result.error) {
            $notify.error("Get an Error, Please retry it.", result.error.message);
            $scope.loadFiles = false;
            return;
          }
          return $scope.$apply(function() {
            $scope.nextPageToken = result.nextPageToken;
            $scope.items = result.items;
            $scope.loadFiles = false;
            return $scope.searchDialog = true;
          });
        });
      };
      $scope.nextPage = function() {
        if (!$scope.nextPageToken || $scope.loadFiles) {
          return;
        }
        $scope.loadFiles = true;
        return gapi.client.drive.files.list(angular.extend(DEFAULT_API_PARAMETER, {
          pageToken: $scope.nextPageToken
        })).execute(function(result) {
          return $scope.$apply(function() {
            var item, _i, _len, _ref;
            if (result.error) {
              $notify.error("Get an Error, Please retry it.", result.error.message);
              $scope.loadFiles = false;
              return;
            }
            $scope.nextPageToken = result.nextPageToken;
            _ref = result.items;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              item = _ref[_i];
              $scope.items.push(item);
            }
            return $scope.loadFiles = false;
          });
        });
      };
      return $scope.setForm = function(item) {
        $scope.libraryKey = item.id;
        $scope.label = item.title;
        $scope.desc = item.description;
        $scope.sourceUrl = "https://script.google.com/d/" + item.id + "/edit";
        return $scope.searchDialog = false;
      };
    }
  ]);

}).call(this);
