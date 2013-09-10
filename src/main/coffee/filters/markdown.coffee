'use strict';

angular.module('markdown')
  .filter 'markdown', ['$markdown', ($markdown) ->
    (input) ->
      return input if !input
      $markdown.marked input

  ]
