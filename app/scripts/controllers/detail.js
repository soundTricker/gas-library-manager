(function() {
  'use strict';
  angular.module('LibraryBoxApp').controller('DetailCtrl', [
    '$scope', '$rootScope', 'type', 'library', function($scope, $rootScope, type, library) {
      $rootScope.activeMenu = type;
      $scope.library = library;
      return $scope.item = library;
    }
  ]);

}).call(this);
