'use strict'

angular.module('LibraryBoxApp')
  .controller 'optionPageCtrl',
    ['$scope','$state','$rootScope','$window','$q','$notify','storage', 'apiUrl', '$analytics', '$location',
    (($scope , $state , $rootScope , $window , $q , $notify , storage, apiUrl, $analytics, $location) ->
      $rootScope.$state = $state
      $rootScope.$on "$stateChangeStart", ()-> $rootScope.isViewLoading = on
      $rootScope.$on "$stateChangeSuccess", ()-> 
        if $state.is 'mine.detail'
          url = $analytics.settings.pageTracking.basePath + "/mine/" + $state.current.url
          $analytics.pageTrack(url)
        else
          url = $analytics.settings.pageTracking.basePath + $location.url()
          $analytics.pageTrack(url)
        $rootScope.isViewLoading = off

      $rootScope.$on "$stateChangeError", ()-> $rootScope.isViewLoading = off

      $rootScope.$on "loggedin" , (e,info)->
        info.userIconUrl = info.userIconUrl || ""
        $scope.loginStatus = "loggedin"
        $scope.userIconUrl = info.userIconUrl.replace(/\?sz=\d+/ ,"?sz=30")
        $scope.nickname = info.nickname
        $scope.$apply()

      $window.gapiIsLoaded = ()->
        gapi.auth.init ()->
          $scope.$apply ()->
            loadApiDefer = (api, version, base)->
              d = $q.defer()
              if base
                  gapi.client.load api, version, ((e)->
                    $scope.$apply ()-> 
                      d.resolve api
                  ), base
              else
                  gapi.client.load api, version, (e)->
                    $scope.$apply ()->
                      d.resolve api
              d.promise

            $q.all([
              # loadApiDefer "plus", "v1"
              loadApiDefer "drive", "v2"
              loadApiDefer "oauth2", "v1"
              # loadApiDefer "libraries", "v1", apiUrl
              # loadApiDefer "members", "v1", apiUrl
            ]).then ()-> 
                $scope.authorize off

      $scope.authorize = (interactive)->

        chrome.identity.getAuthToken interactive : interactive, (token)->

          if chrome.runtime.lastError
            console.log chrome.runtime.lastError
            $rootScope.loginStatus = "notAuthorized"
            $notify.info "Please authorize App", "You have not authorized this app, In this state, GLB is limited."
            return $scope.$apply()

          if !token?
            $rootScope.loginStatus = "notAuthorized"
            $notify.info "Please authorize App", "You have not authorized this app, In this state, GLB is limited."
            return $scope.$apply()

          gapi.client.oauth2.tokeninfo(access_token : token).execute (result)->
            if result.error
              gapi.auth.setToken access_token : ""
              chrome.identity.removeCachedAuthToken token : token, ()-> 
                $rootScope.loginStatus = "notAuthorized"
                $notify.info "Please authorize App", "You have not authorized this app, In this state, GLB is limited."
                return $scope.$apply()

          gapi.auth.setToken access_token : token


          $rootScope.loginStatus = "loaded"
          # gapi.client.members.get
          #   userKey : "me"
          # .execute (result)->
          #   if result.code is 404
          #     $notify.info "Please Sign Up", "You are not registered to gas-library-box service.<br> If you want to publish your library to gas-library-box , please sign up."
          #     $scope.loginStatus = "givenRegister"
          #   else
          #     $rootScope.loginUser = result
          #     $rootScope.$emit "loggedin" , result

          #   $rootScope.loggedin = result.code isnt 404

          $rootScope.gapiLoaded = on
          $rootScope.$emit 'gapiLoaded'
          $scope.$apply()
      $scope.showRegister = ()->
        $state.go "register"
    )]
