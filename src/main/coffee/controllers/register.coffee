'use strict'

angular.module('LibraryBoxApp')
  .controller 'RegisterCtrl', ['$scope','$rootScope','notify','$location', ($scope,$rootScope,notify,$location) ->
    $scope.register = ()->
      gapi.client.members.register
        nickname : $scope.nickname
        url : $scope.plusResult.url
        userIconUrl : if $scope.useIcon is "use" then $scope.userIconUrl else ""
      .execute (result)->
        console.log result
        return if result.error

        notify
          message : "Registered"
          template : "views/notify.html"
          scope :
            title : "Registered your account to gas-library-box"
            type : "alert-success"
        $rootScope.$broadcast "loggedin" , {
          userIconUrl : result.userIconUrl
          nickname : result.nickname
        }
        $location.path '/'
        return

    loadInitialData = ()->

      if $rootScope.loggedin
        notify
          message : "You are already registered gas-library-box"
          template : "views/notify.html"
          scope :
            title : "Warnning"
            type : "alert-warnning"
        $location.path '/'
        return

      gapi.client.plus.people.get({userId : "me"}).execute (result)->
        console.log result
        if result.error
          return notify 
            message : "You are not registered to gas-library-box service.<br> If you want to publish your library to gas-library-box , please sign up."
            template : "views/notify.html"
            scope :
              title : "Please Sign Up"
              type : "alert-info"
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
