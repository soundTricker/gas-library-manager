(function() {
  'use strict';
  angular.module('LibraryBoxApp').controller('GlobalCtrl', [
    '$scope', '$rootScope', '$stateParams', '$filter', '$state', 'result', '$q', 'storage', function($scope, $rootScope, $stateParams, $filter, $state, result, $q, storage) {
      var filter, isMyLibrary, isStocked, item, libraries, _i, _len, _results;
      $scope.next = result.nextPageToken;
      libraries = result.items || [];
      $scope.currentPage = 1;
      $scope.maxSize = 3;
      $scope.entryLimit = 20;
      $scope.currentSearch = $stateParams.q;
      $scope.search = {
        $: $stateParams.q
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
      $scope.query = function() {
        if ($scope.search.$ == null) {
          return $state.go("global");
        }
        return $state.go("global", {
          q: $scope.search.$
        });
      };
      $scope.showMore = function() {
        if ($scope.currentSearch) {
          return gapi.client.libraries.search({
            nextToken: $scope.next,
            query: $scope.currentSearch
          }).execute(function(result) {
            var item, _i, _len, _ref;
            _ref = result.items;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              item = _ref[_i];
              item.isStocked = isStocked(item.libraryKey);
              item.isMyLibrary = isMyLibrary(item.libraryKey);
              libraries.push(item);
            }
            $scope.next = result.nextPageToken;
            $scope.filtered = filter();
            return $scope.$apply();
          });
        } else {
          return gapi.client.libraries.list({
            cursor: $scope.next
          }).execute(function(result) {
            var item, _i, _len, _ref;
            _ref = result.items;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              item = _ref[_i];
              item.isStocked = isStocked(item.libraryKey);
              item.isMyLibrary = isMyLibrary(item.libraryKey);
              libraries.push(item);
            }
            $scope.next = result.nextPageToken;
            $scope.filtered = filter();
            return $scope.$apply();
          });
        }
      };
      isMyLibrary = function(item) {
        var d;
        d = $q.defer();
        if ($rootScope.loginUser) {
          d.resolve(item.authorKey === $rootScope.loginUser.memberKey);
        } else {
          storage.getLibrary(item.libraryKey).then(function(library) {
            if (!library) {
              return d.resolve(false);
            }
            if (library.isExternal) {
              return d.resolve(false);
            }
            return d.resolve(true);
          });
        }
        return d.promise;
      };
      isStocked = function(libraryKey) {
        var d;
        d = $q.defer();
        storage.getLibrary(libraryKey).then(function(library) {
          if (!library) {
            return d.resolve(false);
          }
          if (library.isExternal) {
            return d.resolve(true);
          }
          return d.resolve(true);
        });
        return d.promise;
      };
      _results = [];
      for (_i = 0, _len = libraries.length; _i < _len; _i++) {
        item = libraries[_i];
        item.isStocked = isStocked(item.libraryKey);
        _results.push(item.isMyLibrary = isMyLibrary(item));
      }
      return _results;
    }
  ]).controller('GlobalLibraryCtrl', [
    '$scope', 'storage', function($scope, storage) {
      $scope.stock = function() {
        var item;
        item = angular.copy($scope.item);
        item.isExternal = true;
        item.key = item.libraryKey;
        return storage.addLibrary(item).then(function() {
          return $scope.item.isStocked = true;
        });
      };
      return $scope.unStock = function() {
        var item;
        item = angular.copy($scope.item);
        return storage.removeLibrary(item.libraryKey).then(function() {
          return $scope.item.isStocked = false;
        });
      };
    }
  ]);

}).call(this);
