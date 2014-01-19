'use strict'

angular.module('LibraryBoxApp')
  .controller 'IndexCtrl', 
  ['$scope','$rootScope',
   ($scope, $rootScope) ->
    console.log "hoge"

  ]
