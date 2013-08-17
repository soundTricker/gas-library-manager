'use strict';

angular.module('gasLibrarySearcherApp')
  .filter 'br', [() ->
    (input) ->
      'br filter: ' + input
  ]
