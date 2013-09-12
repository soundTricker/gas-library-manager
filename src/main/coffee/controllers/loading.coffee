'use strict'

angular.module('LibraryBoxApp')
  .controller 'LoadingCtrl', ['$scope','$rootScope', ($scope, $rootScope) ->
    console.log $scope
    $rootScope.$on "hide" , ()->
      $scope.hide = true
  ]
