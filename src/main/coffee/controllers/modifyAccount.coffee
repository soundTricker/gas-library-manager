'use strict'

angular.module('LibraryBoxApp')
  .controller 'ModifyAccountCtrl', ['$scope','$rootScope','notify','$state','$q', ($scope,$rootScope,notify,$state, $q) ->

    $scope.processing = off

    $scope.modify = ()->
      gapi.client.members.put
        nickname : $scope.nickname
        url : $scope.result.url
        userIconUrl : if $scope.useIcon is "use" then $scope.userIconUrl else ""
      .execute (result)->
        if result.error
          return notify 
            message : result.error.message
            template : "views/notify.html"
            scope :
              title : "Got Error"
              type : "alert-error"

        notify
          message : "Updated"
          template : "views/notify.html"
          scope :
            title : "Update your account to gas-library-box"
            type : "alert-success"
        $rootScope.$broadcast "loggedin" , {
          userIconUrl : result.userIconUrl
          nickname : result.nickname
        }
        $scope.processing = off
        $state.go 'top'
        return

    loadInitialData = ()->

      if !$rootScope.loggedin
        notify
          message : "You are not registered gas-library-box"
          template : "views/notify.html"
          scope :
            title : "Warnning"
            type : "alert-warnning"
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
        if people.error || me.error
          return notify 
            message : people.error?.message || me.error.message
            template : "views/notify.html"
            scope :
              title : "Got Error, Please reflesh page"
              type : "alert-error"

        $scope.result = me
        $scope.nickname = me.nickname
        $scope.userIconUrl = people.image.url
        $scope.loaded = on

    if $rootScope.gapiLoaded
      loadInitialData()
    else
      $rootScope.$on 'gapiLoaded' , loadInitialData
  ]