'use strict';

angular.module('markdown')
  .filter 'markdown', ['$markdown', ($markdown) ->
    (input) ->
      console.log $markdown
      $markdown.marked input

  ]
