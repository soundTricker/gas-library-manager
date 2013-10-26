(function() {
  'use strict';
  angular.module('LibraryBoxApp').controller('LoadingCtrl', [
    '$scope', '$rootScope', function($scope, $rootScope) {
      return $rootScope.$on("hide", function() {
        return $scope.hide = true;
      });
    }
  ]);

}).call(this);
