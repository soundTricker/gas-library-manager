(function() {
  'use strict';
  angular.module('markdown').filter('markdown', [
    '$markdown', function($markdown) {
      return function(input) {
        console.log($markdown);
        return $markdown.marked(input);
      };
    }
  ]);

}).call(this);
