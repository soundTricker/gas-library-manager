'use strict'

angular.module('LibraryBoxApp')
  .controller 'PublishCtrl', ['$scope','$rootScope','$q','notify', ($scope, $rootScope, $q, notify) ->
    $scope.opts = 
      backdropFade : yes
      dialogFade : yes

    $scope.isPublishedLibrary = (key)->
      return $rootScope.libraryMap[key]?.published if $rootScope.libraryMap

      d = $q.defer()

      $rootScope.$on 'loadedLibraries', ()->
        d.resolve $rootScope.libraryMap[key]?.published

      d.promise

    $scope.publish = ()->
      item = $scope.item
      loginUser = $rootScope.loginUser
      gapi.client.libraries.insert(
        libraryKey : item.key
        label : item.label
        desc : item.desc
        longDesc : item.longDesc
        sourceUrl : item.sourceUrl
        authorName : loginUser.nickname
        authorUrl : loginUser.url
        authorKey : loginUser.key
      ).execute (result)->
        console.log result
        if result.error

          if result.error.code is 409
            chrome.storage.sync.get "libraries" , (res)->
              libraries = res?.libraries || {}
              item.published = yes
              libraries[item.key] = item
              chrome.storage.sync.set {"libraries" : libraries}

          $scope.openDialog = false
          notify
              message : result.error.message
              template : "views/notify.html"
              scope :
                title : "Got error"
                type : "alert-error"
          $scope.$apply()
          return
        else
          chrome.storage.sync.get "libraries" , (res)->
            libraries = res?.libraries || {}
            item.published = yes
            libraries[item.key] = item
            chrome.storage.sync.set {"libraries" : libraries} , ()->
              $scope.$apply ()->
                $scope.openDialog = false
                notify
                    message : "Success Publish Library"
                    template : "views/notify.html"
                    scope :
                      title : "Published Library"
                      type : "alert-success"
                return

    $scope.update = ()->
      item = $scope.item
      loginUser = $rootScope.loginUser
      gapi.client.libraries.put(
        libraryKey : item.key
        label : item.label
        desc : item.desc
        longDesc : item.longDesc
        sourceUrl : item.sourceUrl
        authorName : loginUser.nickname
        authorUrl : loginUser.url
        authorKey : loginUser.key
      ).execute (result)->
        console.log result
        if result.error

          if result.error.code is 404
            chrome.storage.sync.get "libraries" , (res)->
              libraries = res?.libraries || {}
              item.published = no
              libraries[item.key] = item
              chrome.storage.sync.set {"libraries" : libraries}

          $scope.openModifyDialog = no
          notify
              message : result.error.message
              template : "views/notify.html"
              scope :
                title : "Got error"
                type : "alert-error"
        else
          $scope.openModifyDialog = no
          notify
              message : "Success Update published library"
              template : "views/notify.html"
              scope :
                title : "Update published library"
                type : "alert-success"
        $scope.$apply()
    $scope.delete = ()->
      item = $scope.item
      gapi.client.libraries.delete(libraryKey : item.key).execute (result)->
        console.log result

        if result.error
          $scope.$apply ()->
            $scope.openDeleteDialog = no
            notify
              message : result.error.message
              template : "views/notify.html"
              scope : 
                title : "Got error"
                type : "alert-error"
        else
          chrome.storage.sync.get "libraries" , (res)->
            libraries = res?.libraries || {}
            item.published = no
            libraries[item.key] = item
            chrome.storage.sync.set {"libraries" : libraries} , ()->
              $scope.$apply ()->
                $scope.openDeleteDialog = no
                $scope.item.published = no
                notify
                    message : "Success Delete published library"
                    template : "views/notify.html"
                    scope :
                      title : "Delete published library"
                      type : "alert-success"


  ]
