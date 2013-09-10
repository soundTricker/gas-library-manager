(function() {
  'use strict';
  angular.module('LibraryBoxApp').filter('escape', [
    function() {
      return function(input) {
        if (!input) {
          return input;
        }
        return input.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      };
    }
  ]).filter('break2br', [
    function() {
      return function(input) {
        if (!input) {
          return input;
        }
        return input.replace(/\r\n/g, "<br>").replace(/\n/g, "<br>").replace(/\r/g, "<br>");
      };
    }
  ]);

}).call(this);
