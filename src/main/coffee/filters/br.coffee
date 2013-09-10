'use strict';

angular.module('LibraryBoxApp')
  .filter('escape' , [() ->
    (input) ->
      return input if !input
      return input.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  ])
  .filter 'break2br', [() ->
    (input) ->
      return input if !input
      return input.replace(/\r\n/g, "<br>").replace(/\n/g, "<br>").replace(/\r/g, "<br>")
  ]
