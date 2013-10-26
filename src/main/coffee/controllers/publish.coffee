'use strict'

angular.module('LibraryBoxApp')
  .controller 'PublishCtrl',
    ['$scope','$rootScope','$notify','storage', 
    ($scope, $rootScope, $notify, storage) ->
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
            $notify.error "Got error", result.error.message
            $scope.$apply()
            return
          item.published = yes
          storage.addLibrary(item).then ()->
            $scope.openDialog = no
            $notify.success "Success publishing library", "#{item.label} is plublished"

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
            $notify.error "Got error", result.error.message
            return
          $scope.openModifyDialog = no
          $notify.success "Success updating library", "#{item.label} is updated"
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
              $notify.error "Got error", result.error.message
          else
            item.published = no
            storage.addLibrary(item).then ()->
              $scope.openDeleteDialog = no
              $scope.item.published = no
              $notify.success "Success deleting published library", "#{item.label} is deleted"
    ]
