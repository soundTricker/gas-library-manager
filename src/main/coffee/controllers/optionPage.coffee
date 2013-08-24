'use strict'

angular.module('LibraryBoxApp')
  .controller 'optionPageCtrl', ['$scope', '$window', '$q', 'notify','$location', (($scope, $window, $q, notify, $location) ->
      $window.gapiIsLoaded = ()->
          gapi.auth.init ()->
              loadApiDefer = (api, version, base)->
                  d = $q.defer()
                  if base
                      gapi.client.load api, version, (()->
                          $scope.$apply ()-> 
                              d.resolve api
                      ), base
                  else
                      gapi.client.load api, version, (()->
                          $scope.$apply ()->
                              d.resolve api
                      )
                  d.promise

              $q.when([
                  loadApiDefer("plus", "v1")
                  loadApiDefer("libraries", "v1", "https://gas-library-box.appspot.com/_ah/api")
                  loadApiDefer("members", "v1","https://gas-library-box.appspot.com/_ah/api")
              ]).then ()-> 
                $scope.loginStatus = "loadFinished"
      $scope.login = ()->
        $scope.loginStatus = ""
        chrome.identity.getAuthToken {interactive : true}, (token)->

          gapi.auth.setToken {"access_token" : token}

          gapi.client.members.get({userKey : "me"}).execute (result)->
            if result.code is 404
              notify "Please Sign Up", "You are not registered to gas-library-box service. If you want to publish your library to gas-library-box , please sign up."
              $scope.loginStatus = "givenRegister"
              $scope.$apply()
              return

      $scope.showRegister = ()->
        $location.path "/register"


  )]
