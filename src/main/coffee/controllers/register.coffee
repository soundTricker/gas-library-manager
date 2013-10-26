'use strict'

angular.module('LibraryBoxApp')
  .controller 'RegisterCtrl', ['$scope','$rootScope','$notify','$state', ($scope,$rootScope,$notify,$state) ->
    $scope.processing = off
    $scope.register = ()->
      $scope.processing = on
      gapi.client.members.register
        nickname : $scope.nickname
        url : $scope.plusResult.url
        userIconUrl : if $scope.useIcon is "use" then $scope.userIconUrl else ""
      .execute (result)->
        return $notify.error "Got Error", result.error.message if result.error
        $notify.success "Registered your account to gas-library-box", "Registered"

        $rootScope.$broadcast "loggedin" ,
          userIconUrl : result.userIconUrl
          nickname : result.nickname
        $state.go 'top'
        return

    loadInitialData = ()->

      if $rootScope.loggedin
        $notify.warn "Warnning", "You are already registered gas-library-box"
        $state.go 'top'
        return

      gapi.client.plus.people.get(userId : "me").execute (result)->
        return $notify.error "Got Error, Please refresh page", result.error.message if result.error

        $scope.plusResult = result
        $scope.nickname = result.nickname
        $scope.userIconUrl = result.image.url
        $scope.loaded = true
        $scope.$apply()

    if $rootScope.gapiLoaded
      loadInitialData()
    else
      $scope.$on 'gapiLoaded' , loadInitialData
  ]
