'use strict'

angular.module('LibraryBoxApp')
  .controller 'DetailCtrl', ['$scope','$rootScope','type','library', ($scope, $rootScope,type, library) ->
    $rootScope.activeMenu = type
    $scope.library = library
    $scope.item = library
  ]
