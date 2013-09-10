'use strict'

libraryBoxApp = angular.module('LibraryBoxApp')
libraryBoxApp.controller 'MainCtrl',["$scope",'$rootScope','$filter' ,($scope, $rootScope, $filter) ->
  $rootScope.activeMenu = "mine"

  $scope.currentPage = 1 #current page
  $scope.maxSize = 3 #pagination max size
  $scope.entryLimit = 20 #max rows for data table


  filter = ()->
    $filter('limitTo')(
      $filter('startFrom')(
        $filter('filter')(
          $rootScope.libraries,
          $scope.search
        ), ($scope.currentPage-1)*$scope.entryLimit
      ), $scope.entryLimit
    )

  $scope.filtered = filter()

  $scope.$watch "search.$" , ()-> 
    $scope.filtered = filter()

  # init pagination with $scope.list
  $scope.noOfPages = Math.ceil $rootScope.libraries.length / $scope.entryLimit
  $scope.setPage = (pageNo)->
      $scope.currentPage = pageNo
  $scope.$watch 'filtered' , ()->
      $scope.noOfPages = Math.ceil $scope.filtered.length / $scope.entryLimit
]

libraryBoxApp.controller 'PrivateLibraryCtrl',["$scope", "$window", ($scope,$window)->

  $scope.modify = false
  $scope.delete = false
  $scope.deleteLibrary = ()->
    if $window.confirm("Are you sure delete #{$scope.item.label} ?")
      chrome.storage.sync.get "libraries" , (res)->
        libraries = res?.libraries || {}
        libraries[$scope.item.key] = undefined
        chrome.storage.sync.set {"libraries" : libraries} , ()->
          alert "deleted"
          $scope.$apply ()->
            $scope.delete = false
    else
      $scope.delete = false

  $scope.modifyLibs = ()->
    $scope.item.label = $scope.label
    $scope.item.desc = $scope.desc
    $scope.item.longDesc = $scope.longDesc
    $scope.item.modifiedAt = new Date().getTime()
    chrome.storage.sync.get "libraries" , (res)->
      libraries = res?.libraries || {}
      libraries[$scope.item.key] = $scope.item
      chrome.storage.sync.set {"libraries" : libraries} , ()->
        $scope.$apply ()->
          $scope.modify = false
  ]
