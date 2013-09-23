'use strict'

angular.module('LibraryBoxApp')
  .controller 'PublishCtrl',
    ['$scope','$rootScope','notify','storage', 
    ($scope, $rootScope, notify, storage) ->
      $scope.opts = 
        backdropFade : yes
        dialogFade : yes

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

          if result.error

            if result.error.code is 409

              item.published = yes
              storage.addLibrary item

            $scope.openDialog = no
            notify
                message : result.error.message
                template : "views/notify.html"
                scope :
                  title : "Got error"
                  type : "alert-error"
            $scope.$apply()
            return
          else
            item.published = yes
            storage.addLibrary(item).then ()->
              $scope.openDialog = no
              notify
                  message : "Success Publish Library"
                  template : "views/notify.html"
                  scope :
                    title : "Published Library"
                    type : "alert-success"

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
          if result.error

            if result.error.code is 404
              item.published = no
              storage.addLibrary item

            $scope.openModifyDialog = no
            notify
                message : result.error.message
                template : "views/notify.html"
                scope :
                  title : "Got error"
                  type : "alert-error"
            return
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
          if result.error
            if result.error.code is 404
              item.published = no
              storage.addLibrary item
            $scope.$apply ()->
              $scope.openDeleteDialog = no
              notify
                message : result.error.message
                template : "views/notify.html"
                scope : 
                  title : "Got error"
                  type : "alert-error"
          else
            item.published = no
            storage.addLibrary(item).then ()->
              $scope.openDeleteDialog = no
              $scope.item.published = no
              notify
                  message : "Success Delete published library"
                  template : "views/notify.html"
                  scope :
                    title : "Delete published library"
                    type : "alert-success"
    ]
