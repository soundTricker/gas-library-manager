'use strict'

angular.module('LibraryBoxApp')
  .controller 'GlobalCtrl', 
    ['$scope','$rootScope','$stateParams','$filter','$state','result', '$q', 'storage'
    ($scope, $rootScope, $stateParams, $filter, $state, result, $q, storage) ->
      $scope.next = result.nextPageToken
      libraries = result.items || []
      $scope.currentPage = 1 #current page
      $scope.maxSize = 3 #pagination max size
      $scope.entryLimit = 20 #max rows for data table
      $scope.currentSearch = $stateParams.q
      $scope.search = $ : $stateParams.q

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
        return $state.go  "global" if !$scope.search.$?
        $state.go "global", q : $scope.search.$


      $scope.showMore = ()->
        if $scope.currentSearch
          gapi.client.libraries.search(
            nextToken : $scope.next
            query : $scope.currentSearch
          ).execute (result)->
            for item in result.items
              item.isStocked = isStocked item.libraryKey
              item.isMyLibrary = isMyLibrary item.libraryKey
              libraries.push item
            $scope.next = result.nextPageToken
            $scope.filtered = filter()
            $scope.$apply()
        else
          gapi.client.libraries.list(
            cursor : $scope.next
          ).execute (result)->
            for item in result.items
              item.isStocked = isStocked item.libraryKey
              item.isMyLibrary = isMyLibrary item.libraryKey
              libraries.push item
            $scope.next = result.nextPageToken
            $scope.filtered = filter()
            $scope.$apply()

      isMyLibrary = (item)->
        d = $q.defer()
        if $rootScope.loginUser
          d.resolve item.authorKey is $rootScope.loginUser.memberKey
        else
          storage.getLibrary(item.libraryKey).then (library)->
            return d.resolve false if !library
            return d.resolve false if library.isExternal
            return d.resolve true
        d.promise

      isStocked = (libraryKey)->
        d = $q.defer()
        storage.getLibrary(libraryKey).then (library)->
          return d.resolve false if !library
          return d.resolve true if library.isExternal
          return d.resolve true
        d.promise

      for item in libraries
        item.isStocked = isStocked item.libraryKey
        item.isMyLibrary = isMyLibrary item

    ]
  .controller 'GlobalLibraryCtrl',
    ['$scope','storage'
    ($scope, storage) ->
      $scope.stock = ()->
        item = angular.copy $scope.item
        item.isExternal = true
        item.key = item.libraryKey
        storage.addLibrary(item).then ()->
          $scope.item.isStocked = true
      $scope.unStock = ()->
        item = angular.copy $scope.item
        storage.removeLibrary(item.libraryKey).then ()->
          $scope.item.isStocked = false
    ]

