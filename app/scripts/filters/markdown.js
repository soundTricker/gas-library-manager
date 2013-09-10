(function() {
  'use strict';
  angular.module('markdown').filter('markdown', [
    '$markdown', function($markdown) {
      return function(input) {
        if (!input) {
          return input;
        }
        return $markdown.marked(input);
      };
    }
  ]);

}).call(this);
