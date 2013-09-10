'use strict';
###*
 * angular smooth-scroll
 * 
 * @author atomita
 * @license MIT
 * @version 0.0.3
###
class SmoothScroll
  @$inject = []

  constructor: ()->
    @duration = "normal"
    @easing = "swing"

  normal: (target, easing, complete, step, offset)->
    @to(target, "normal", easing, complete, step, offset)
    return

  slow: (target, easing, complete, step)->
    @to(target, "slow", easing, complete, step, offset)
    return

  fast: (target, easing, complete, step)->
    @to(target, "fast", easing, complete, step, offset)
    return

  to: (target, duration, easing, complete, step, offset)->
    position = angular.element(target).offset().top
    offset and position += offset

    opt =
      "duration": duration or @duration
      "easing": easing or @easing
      "queue": false

    is_comepleted = false
    if angular.isFunction(complete)
      opt.complete = (args...)->
        complete.apply(null, args) if not is_comepleted
        is_comepleted = true
    opt.step = ((args...)-> step.apply(null, args) if not is_comepleted) if angular.isFunction(step)

    angular.element("html, body").animate({"scrollTop": position}, opt)
    return


angular.module('LibraryBoxApp')
  .directive 'smoothScroll', ['$window', ($window)->
    restrict: 'AC'
    link: (scope, element, attrs) ->
      target = attrs.smoothScroll or $window
      element.bind 'click', ()->
        $this = angular.element(element)
        target = $this.attr("smooth-scroll") || $window
        attrs = 
          scrollDuration : $this.attr "scroll-duration"
          scrollEasing : $this.attr "scroll-easing"
          scrollOffset : $this.attr "scroll-offset"

        new SmoothScroll().to target, attrs.scrollDuration, attrs.scrollEasing, null , null, parseInt attrs.scrollOffset || "0"
  ]
