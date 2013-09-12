(function() {
  'use strict';
  angular.module('LibraryBoxApp').controller('LoadingCtrl', [
    '$scope', '$rootScope', function($scope, $rootScope) {
      console.log($scope);
      return $rootScope.$on("hide", function() {
        return $scope.hide = true;
      });
    }
  ]);

}).call(this);
