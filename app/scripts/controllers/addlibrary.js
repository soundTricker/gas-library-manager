(function() {
  'use strict';
  angular.module('LibraryBoxApp').controller('AddLibraryCtrl', [
    '$scope', 'storage', '$notify', '$state', function($scope, storage, $notify, $state) {
      var libraries;
      libraries = storage.getLibrariesMapSync();
      $scope.isNotLibraryExist = function() {
        if (!$scope.addLibraryForm.libraryKey.$viewValue) {
          return true;
        }
        return libraries[$scope.addLibraryForm.libraryKey.$viewValue] == null;
      };
      return $scope.addLibrary = function(library) {
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
    }
  ]);

}).call(this);
