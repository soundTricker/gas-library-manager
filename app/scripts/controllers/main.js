(function() {
  'use strict';
  var libraryBoxApp;

  libraryBoxApp = angular.module('LibraryBoxApp');

  libraryBoxApp.controller('MainCtrl', function($scope) {
    chrome.storage.onChanged.addListener(function(changes, areaName) {
      var item, key;
      if (areaName !== "sync") {
        return;
      }
      $scope.libraries = (function() {
        var _ref, _ref1, _results;
        _ref1 = (changes != null ? (_ref = changes.libraries) != null ? _ref.newValue : void 0 : void 0) || {};
        _results = [];
        for (key in _ref1) {
          item = _ref1[key];
          if (item.key) {
            _results.push(item);
          }
        }
        return _results;
      })();
      return $scope.$apply();
    });
    return chrome.storage.sync.get("libraries", function(res) {
      var item, key;
      $scope.libraries = (function() {
        var _ref, _results;
        _ref = (res != null ? res.libraries : void 0) || {};
        _results = [];
        for (key in _ref) {
          item = _ref[key];
          if (item.key) {
            _results.push(item);
          }
        }
        return _results;
      })();
      return $scope.$apply();
    });
  });

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
