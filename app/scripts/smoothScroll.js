(function() {
  'use strict';
  angular.module('LibraryBoxApp').directive('smoothScroll', [
    function() {
      return {
        template: '<div></div>',
        restrict: 'E',
        link: function(scope, element, attrs) {
          return element.text('this is the smoothScroll directive');
        }
      };
    }
  ]);

}).call(this);
