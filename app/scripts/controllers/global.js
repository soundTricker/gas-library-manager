(function() {
  'use strict';
  angular.module('LibraryBoxApp').controller('GlobalCtrl', [
    '$scope', '$rootScope', '$route', '$filter', '$location', 'libraries', function($scope, $rootScope, $route, $filter, $location, libraries) {
      var filter;
      console.log(libraries);
      $rootScope.activeMenu = "global";
      $scope.currentPage = 1;
      $scope.maxSize = 3;
      $scope.entryLimit = 20;
      $scope.search = {
        $: $route.current.params.q
      };
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
      $scope.$watch('filtered', function() {
        return $scope.noOfPages = Math.ceil($scope.filtered.length / $scope.entryLimit);
      });
      return $scope.query = function() {
        return location.hash = "#/global?q=" + $scope.search.$;
      };
    }
  ]);

}).call(this);
