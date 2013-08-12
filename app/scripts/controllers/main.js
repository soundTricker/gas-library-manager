(function() {
  'use strict';
  angular.module('LibraryBoxApp').controller('MainCtrl', function($scope) {
    chrome.storage.onChanged.addListener(function(changes, areaName) {
      if (areaName !== "sync") {
        return;
      }
      return $scope.$apply(function() {
        var item, key;
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
        return console.log($scope.libraries);
      });
    });
    chrome.storage.sync.get("libraries", function(res) {
      return $scope.$apply(function() {
        var item, key;
        return $scope.libraries = (function() {
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
      });
    });
    $scope.deleteLibrary = function(item, libraryRow) {
      return chrome.storage.sync.get("libraries", function(res) {
        var libraries;
        libraries = (res != null ? res.libraries : void 0) || {};
        libraries[item.key] = void 0;
        return chrome.storage.sync.set({
          "libraries": libraries
        }, function() {
          return alert("deleted");
        });
      });
    };
    return $scope.modifyLibs = function(modifyLibrary, item, modify) {
      item.label = modifyLibrary.label;
      item.desc = modifyLibrary.desc;
      modify = false;
      return chrome.storage.sync.get("libraries", function(res) {
        var libraries;
        libraries = (res != null ? res.libraries : void 0) || {};
        libraries[item.key] = item;
        return chrome.storage.sync.set({
          "libraries": libraries
        }, function() {
          return alert("modified");
        });
      });
    };
  });

}).call(this);
