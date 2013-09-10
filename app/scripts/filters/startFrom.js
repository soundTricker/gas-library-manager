(function() {
  'use strict';
  angular.module('LibraryBoxApp').filter('startFrom', [
    function() {
      return function(input, start) {
        if (!input) {
          return [];
        }
        start = +start;
        return input.slice(start);
      };
    }
  ]);

}).call(this);
