(function() {
  'use strict';
  /**
   * angular smooth-scroll
   * 
   * @author atomita
   * @license MIT
   * @version 0.0.3
  */

  var SmoothScroll,
    __slice = [].slice;

  SmoothScroll = (function() {
    SmoothScroll.$inject = [];

    function SmoothScroll() {
      this.duration = "normal";
      this.easing = "swing";
    }

    SmoothScroll.prototype.normal = function(target, easing, complete, step, offset) {
      this.to(target, "normal", easing, complete, step, offset);
    };

    SmoothScroll.prototype.slow = function(target, easing, complete, step) {
      this.to(target, "slow", easing, complete, step, offset);
    };

    SmoothScroll.prototype.fast = function(target, easing, complete, step) {
      this.to(target, "fast", easing, complete, step, offset);
    };

    SmoothScroll.prototype.to = function(target, duration, easing, complete, step, offset) {
      var is_comepleted, opt, position;
      position = angular.element(target).offset().top;
      offset && (position += offset);
      opt = {
        "duration": duration || this.duration,
        "easing": easing || this.easing,
        "queue": false
      };
      is_comepleted = false;
      if (angular.isFunction(complete)) {
        opt.complete = function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          if (!is_comepleted) {
            complete.apply(null, args);
          }
          return is_comepleted = true;
        };
      }
      if (angular.isFunction(step)) {
        opt.step = (function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          if (!is_comepleted) {
            return step.apply(null, args);
          }
        });
      }
      angular.element("html, body").animate({
        "scrollTop": position
      }, opt);
    };

    return SmoothScroll;

  })();

  angular.module('LibraryBoxApp').directive('smoothScroll', [
    '$window', function($window) {
      return {
        restrict: 'AC',
        link: function(scope, element, attrs) {
          var target;
          target = attrs.smoothScroll || $window;
          return element.bind('click', function() {
            var $this;
            $this = angular.element(element);
            target = $this.attr("smooth-scroll") || $window;
            attrs = {
              scrollDuration: $this.attr("scroll-duration"),
              scrollEasing: $this.attr("scroll-easing"),
              scrollOffset: $this.attr("scroll-offset")
            };
            return new SmoothScroll().to(target, attrs.scrollDuration, attrs.scrollEasing, null, null, parseInt(attrs.scrollOffset || "0"));
          });
        }
      };
    }
  ]);

}).call(this);
