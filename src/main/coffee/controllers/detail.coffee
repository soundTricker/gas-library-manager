'use strict'

angular.module('LibraryBoxApp')
  .controller 'DetailCtrl', 
  ['$scope','$rootScope','library','$state','$notify', 
  ($scope, $rootScope, library, $state,$notify) ->
    if !library
      $notify.warn "Library is not found", "Library #{$state.params.key} is not found."
      return $state.go "mine" 
    $scope.library = library
    $scope.item = library
  ]
