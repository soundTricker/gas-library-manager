'use strict'

angular.module('LibraryBoxApp')
  .controller 'DetailCtrl', ['$scope','$rootScope','library', ($scope, $rootScope, library, $filter) ->
    $scope.library = library
    $scope.item = library
  ]
