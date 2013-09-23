'use strict'

angular.module('LibraryBoxApp')
  .controller 'IndexCtrl', ['$scope','$rootScope', ($scope, $rootScope) ->
    $scope.awesomeThings = [
      'HTML5 Boilerplate'
      'AngularJS'
      'Karma'
    ]
  ]
