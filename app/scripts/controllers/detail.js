(function() {
  'use strict';
  angular.module('LibraryBoxApp').controller('DetailCtrl', [
    '$scope', '$rootScope', 'library', function($scope, $rootScope, library, $filter) {
      $scope.library = library;
      return $scope.item = library;
    }
  ]);

}).call(this);
