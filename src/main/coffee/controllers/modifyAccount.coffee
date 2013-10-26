'use strict'

angular.module('LibraryBoxApp')
  .controller 'ModifyAccountCtrl', ['$scope','$rootScope','$notify','$state','$q', ($scope,$rootScope,$notify,$state, $q) ->

    $scope.processing = off

    $scope.modify = ()->
      gapi.client.members.put
        nickname : $scope.nickname
        url : $scope.result.url
        userIconUrl : if $scope.useIcon is "use" then $scope.userIconUrl else ""
      .execute (result)->
        return $notify.error "Got Error", result.error.message if result.error

        $notify.success "Update your account" , "Updated"
        $rootScope.$broadcast "loggedin",
          userIconUrl : result.userIconUrl
          nickname : result.nickname
        $scope.processing = off
        $state.go 'top'

    loadInitialData = ()->

      if !$rootScope.loggedin
        $notify.warn "Warnning" , "You are not registered gas-library-box, Please register account"
        $state.go 'register'
        return

      people = ()->
        d = $q.defer()
        gapi.client.plus.people.get({userId : "me"}).execute (result)->
          $scope.$apply ()-> d.resolve result
        d.promise
      members = ()->
        d = $q.defer()
        gapi.client.members.get({userKey : "me"}).execute (result)->
          $scope.$apply ()-> d.resolve result
        d.promise

      $q.all([people(), members()]).then (results)->
        people = results[0]
        me = results[1]
        return $notify.error("Got Error, Please reflesh page", people.error?.message || me.error.message) if people.error || me.error

        $scope.result = me
        $scope.nickname = me.nickname
        $scope.userIconUrl = people.image.url
        $scope.loaded = on

    if $rootScope.gapiLoaded
      loadInitialData()
    else
      $rootScope.$on 'gapiLoaded' , loadInitialData
  ]