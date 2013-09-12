'use strict'

angular.module('LibraryBoxApp')
  .controller 'GlobalCtrl', ['$scope','$rootScope','$route','$filter','$location','libraries', ($scope, $rootScope,$route, $filter,$location, libraries) ->
    console.log libraries
    $rootScope.activeMenu = "global"

    $scope.currentPage = 1 #current page
    $scope.maxSize = 3 #pagination max size
    $scope.entryLimit = 20 #max rows for data table

    $scope.search = $ : $route.current.params.q

    filter = ()->
      $filter('limitTo')(
        $filter('startFrom')(
          $filter('filter')(
            libraries,
            $scope.search
          ), ($scope.currentPage-1)*$scope.entryLimit
        ), $scope.entryLimit
      )

    $scope.filtered = filter()

    $scope.$watch "search.$" , ()-> 
      $scope.filtered = filter()

    # init pagination with $scope.list
    $scope.noOfPages = Math.ceil libraries.length / $scope.entryLimit
    $scope.setPage = (pageNo)->
        $scope.currentPage = pageNo
    $scope.$watch 'filtered' , ()->
        $scope.noOfPages = Math.ceil $scope.filtered.length / $scope.entryLimit

    $scope.query = ()->
      location.hash = "#/global?q=#{$scope.search.$}" 

  ]
