'use strict';

angular.module('LibraryBoxApp')
  .filter 'startFrom', [() ->
    (input, start) -> 
      return [] if !input
      start = +start
      return input.slice start
  ]
