(function() {
  'use strict';
  var Storage,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('LibraryBoxApp').service('storage', [
    '$rootScope', '$q', Storage = (function() {
      function Storage($rootScope, $q) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.$q = $q;
        this.removeLibrary = __bind(this.removeLibrary, this);
        this.addLibraries = __bind(this.addLibraries, this);
        this.addLibrary = __bind(this.addLibrary, this);
        this.getLibraries = __bind(this.getLibraries, this);
        this.getLibrary = __bind(this.getLibrary, this);
        chrome.storage.onChanged.addListener(function(changes, areaName) {
          var item, key;
          if (areaName !== "local") {
            return;
          }
          _this.$rootScope.$digest("addLibrary", {
            changes: changes
          });
          _this.libraryMap = changes.libraries.newValue;
          _this.libraries = (function() {
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
          return $rootScope.$apply();
        });
      }

      Storage.prototype.getLibrary = function(libraryKey) {
        var d,
          _this = this;
        d = this.$q.defer();
        if (this.libraryMap) {
          d.resolve(angular.copy(this.libraryMap[libraryKey]));
        } else {
          this.getLibraries().then(function(libraries) {
            return d.resolve(angular.copy(libraries[libraryKey]));
          });
        }
        return d.promise;
      };

      Storage.prototype.getLibraries = function() {
        var d,
          _this = this;
        d = this.$q.defer();
        chrome.storage.local.get("libraries", function(res) {
          var item, key;
          _this.libraryMap = (res != null ? res.libraries : void 0) || {};
          _this.libraries = (function() {
            var _ref, _results;
            _ref = this.libraryMap;
            _results = [];
            for (key in _ref) {
              item = _ref[key];
              if (item.key) {
                _results.push(item);
              }
            }
            return _results;
          }).call(_this);
          return _this.$rootScope.$apply(function() {
            return d.resolve(angular.copy(_this.libraryMap));
          });
        });
        return d.promise;
      };

      Storage.prototype.addLibrary = function(library) {
        var d,
          _this = this;
        d = this.$q.defer();
        this.getLibraries().then(function(libraries) {
          libraries[library.key || library.libraryKey] = library;
          return chrome.storage.local.set({
            "libraries": libraries
          }, function() {
            return _this.$rootScope.$apply(function() {
              return d.resolve(angular.copy(libraries));
            });
          });
        });
        return d.promise;
      };

      Storage.prototype.addLibraries = function(libraryMap) {
        var d,
          _this = this;
        d = this.$q.defer();
        return this.getLibraries().then(function(libraries) {
          var key, library;
          for (key in libraryMap) {
            library = libraryMap[key];
            libraries[key] = library;
          }
          return chrome.storage.local.set({
            "libraries": libraries
          }, function() {
            return d.resolve(angular.copy(libraries));
          });
        });
      };

      Storage.prototype.removeLibrary = function(libraryKey) {
        var d,
          _this = this;
        d = this.$q.defer();
        this.getLibraries().then(function(libraries) {
          libraries[libraryKey] = void 0;
          return chrome.storage.local.set({
            "libraries": libraries
          }, function() {
            return _this.$rootScope.$apply(function() {
              return d.resolve(libraries);
            });
          });
        });
        return d.promise;
      };

      return Storage;

    })()
  ]);

}).call(this);
