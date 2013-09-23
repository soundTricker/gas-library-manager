(function() {
  'use strict';
  angular.module('LibraryBoxApp').controller('IndexCtrl', [
    '$scope', '$rootScope', function($scope, $rootScope) {
      return $scope.awesomeThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma'];
    }
  ]);

}).call(this);
