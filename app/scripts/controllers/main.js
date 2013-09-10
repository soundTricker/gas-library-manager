(function() {
  'use strict';
  var libraryBoxApp;

  libraryBoxApp = angular.module('LibraryBoxApp');

  libraryBoxApp.controller('MainCtrl', [
    "$scope", '$rootScope', '$filter', function($scope, $rootScope, $filter) {
      var filter;
      $rootScope.activeMenu = "mine";
      $scope.currentPage = 1;
      $scope.maxSize = 3;
      $scope.entryLimit = 20;
      filter = function() {
        return $filter('limitTo')($filter('startFrom')($filter('filter')($rootScope.libraries, $scope.search), ($scope.currentPage - 1) * $scope.entryLimit), $scope.entryLimit);
      };
      $scope.filtered = filter();
      $scope.$watch("search.$", function() {
        return $scope.filtered = filter();
      });
      $scope.noOfPages = Math.ceil($rootScope.libraries.length / $scope.entryLimit);
      $scope.setPage = function(pageNo) {
        return $scope.currentPage = pageNo;
      };
      return $scope.$watch('filtered', function() {
        return $scope.noOfPages = Math.ceil($scope.filtered.length / $scope.entryLimit);
      });
    }
  ]);

  libraryBoxApp.controller('PrivateLibraryCtrl', [
    "$scope", "$window", function($scope, $window) {
      $scope.modify = false;
      $scope["delete"] = false;
      $scope.deleteLibrary = function() {
        if ($window.confirm("Are you sure delete " + $scope.item.label + " ?")) {
          return chrome.storage.sync.get("libraries", function(res) {
            var libraries;
            libraries = (res != null ? res.libraries : void 0) || {};
            libraries[$scope.item.key] = void 0;
            return chrome.storage.sync.set({
              "libraries": libraries
            }, function() {
              alert("deleted");
              return $scope.$apply(function() {
                return $scope["delete"] = false;
              });
            });
          });
        } else {
          return $scope["delete"] = false;
        }
      };
      return $scope.modifyLibs = function() {
        $scope.item.label = $scope.label;
        $scope.item.desc = $scope.desc;
        $scope.item.longDesc = $scope.longDesc;
        $scope.item.modifiedAt = new Date().getTime();
        return chrome.storage.sync.get("libraries", function(res) {
          var libraries;
          libraries = (res != null ? res.libraries : void 0) || {};
          libraries[$scope.item.key] = $scope.item;
          return chrome.storage.sync.set({
            "libraries": libraries
          }, function() {
            return $scope.$apply(function() {
              return $scope.modify = false;
            });
          });
        });
      };
    }
  ]);

}).call(this);
