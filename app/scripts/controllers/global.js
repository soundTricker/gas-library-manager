(function() {
  'use strict';
  angular.module('LibraryBoxApp').controller('GlobalCtrl', [
    '$scope', '$rootScope', '$filter', 'libraries', function($scope, $rootScope, $filter, libraries) {
      var filter;
      console.log("hoge");
      console.log(libraries);
      $rootScope.activeMenu = "global";
      $scope.currentPage = 1;
      $scope.maxSize = 3;
      $scope.entryLimit = 20;
      filter = function() {
        return $filter('limitTo')($filter('startFrom')($filter('filter')(libraries, $scope.search), ($scope.currentPage - 1) * $scope.entryLimit), $scope.entryLimit);
      };
      $scope.filtered = filter();
      $scope.$watch("search.$", function() {
        return $scope.filtered = filter();
      });
      $scope.noOfPages = Math.ceil(libraries.length / $scope.entryLimit);
      $scope.setPage = function(pageNo) {
        return $scope.currentPage = pageNo;
      };
      return $scope.$watch('filtered', function() {
        return $scope.noOfPages = Math.ceil($scope.filtered.length / $scope.entryLimit);
      });
    }
  ]);

}).call(this);
