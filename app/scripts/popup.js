(function() {
  var PopupCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  angular.module('LibraryBoxApp', ['ui.bootstrap', 'ui.directives']).run([
    "$rootScope", function($rootScope) {
      return $rootScope.i18n = function() {
        var args, key;
        key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (args.length > 0) {
          return chrome.i18n.getMessage.apply(chrome.i18n, [key].concat(args));
        } else {
          return chrome.i18n.getMessage.apply(chrome.i18n, [key]);
        }
      };
    }
  ]).controller("popup", [
    "$scope", "storage", '$filter', PopupCtrl = (function() {
      function PopupCtrl($scope, storage, $filter) {
        var _this = this;
        this.$scope = $scope;
        this.storage = storage;
        this.$filter = $filter;
        this.chainFilter = __bind(this.chainFilter, this);
        this.showOptionPage = __bind(this.showOptionPage, this);
        this.showSourcePage = __bind(this.showSourcePage, this);
        this.search = {
          $: ""
        };
        this.currentPage = 1;
        this.$scope.maxSize = 3;
        this.$scope.entryLimit = 3;
        this.libraries = this.storage.getLibrariesSync();
        this.limitTo = this.$filter('limitTo');
        this.startFrom = this.$filter('startFrom');
        this.filter = this.$filter('filter');
        this.filtered = this.chainFilter();
        this.noOfPages = Math.ceil(this.filtered.length / this.$scope.entryLimit);
        this.$scope.$watch("ctrl.search.$", function() {
          return _this.filtered = _this.chainFilter();
        });
        this.$scope.$watch("ctrl.currentPage", function() {
          return _this.filtered = _this.chainFilter();
        });
        this.$scope.$watch("ctrl.filtered", function() {
          return _this.$scope.noOfPages = Math.ceil(_this.filter(_this.libraries, _this.search).length / _this.$scope.entryLimit);
        });
        this.$scope.setPage = function(pageNo) {
          return _this.currentPage = pageNo;
        };
      }

      PopupCtrl.prototype.showSourcePage = function() {
        return chrome.runtime.sendMessage({
          action: "logEvent",
          "event": "viewSource",
          "source": "viewSourceLink",
          "from": "popup"
        });
      };

      PopupCtrl.prototype.showOptionPage = function() {
        chrome.runtime.sendMessage({
          action: "logEvent",
          "event": "showOptionPage",
          "source": "showOptionPage",
          "from": "popup"
        });
        return chrome.runtime.sendMessage({
          action: "showOptionPage"
        });
      };

      PopupCtrl.prototype.showMyLibrariesPage = function(key) {
        chrome.runtime.sendMessage({
          action: "logEvent",
          "event": "viewMyLibraryPage",
          "source": "viewDetailLink",
          "from": "popup"
        });
        return chrome.runtime.sendMessage({
          action: "showMyLibraryPage",
          key: key
        });
      };

      PopupCtrl.prototype.chainFilter = function() {
        return this.limitTo(this.startFrom(this.filter(this.libraries, this.search), (this.currentPage - 1) * this.$scope.entryLimit), this.$scope.entryLimit);
      };

      return PopupCtrl;

    })()
  ]);

}).call(this);
