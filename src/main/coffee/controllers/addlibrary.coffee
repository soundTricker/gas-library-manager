'use strict'

DEFAULT_API_PARAMETER = 
  q : "mimeType = 'application/vnd.google-apps.script'"
  fields : "items(createdDate,defaultOpenWithLink,description,exportLinks,iconLink,id,lastModifyingUser,modifiedDate,originalFilename,owners,properties,selfLink,title,webContentLink,webViewLink),nextPageToken"


angular.module('LibraryBoxApp')
  .controller 'AddLibraryCtrl', [
    '$scope','storage','$notify','$state','$window'
    ($scope , storage , $notify , $state , $window) ->
      $scope.loadFiles = off
      $scope.opts = 
        backdropFade : yes
        dialogFade : yes
        dialogClass : "modal file-choose-modal"
      libraries = storage.getLibrariesMapSync()

      $scope.isNotLibraryExist = ()->
        return on if !$scope.addLibraryForm.libraryKey.$viewValue
        return !libraries[$scope.addLibraryForm.libraryKey.$viewValue]?

      $scope.addLibrary = (library)->
        $scope.saving = on
        item = 
          key : $scope.libraryKey
          label : $scope.label
          desc : $scope.desc
          longDesc : $scope.longDesc
          sourceUrl : $scope.sourceUrl
          registeredAt : new Date().getTime()
          modifiedAt : new Date().getTime()

        if !$scope.isNotLibraryExist(item.key)
          return

        storage.addLibrary(item).then ()->
          $notify.info "Add Library" , "#{$scope.label} have been added"
          $scope.saving = off
          $state.go 'mine'

      $scope.showPicker = ()->
        $scope.loadFiles = on
        gapi.client.drive.files
        .list(DEFAULT_API_PARAMETER)
        .execute (result)->

          if result.error
            $notify.error "Get an Error, Please retry it.", result.error.message
            $scope.loadFiles = off
            return

          $scope.$apply ()->
            $scope.nextPageToken = result.nextPageToken
            $scope.items = result.items
            $scope.loadFiles = off
            $scope.searchDialog = on

      $scope.nextPage = ()->
        return if !$scope.nextPageToken || $scope.loadFiles
        $scope.loadFiles = on
        gapi.client.drive.files
        .list(angular.extend(DEFAULT_API_PARAMETER,{pageToken : $scope.nextPageToken }))
        .execute (result)->
          $scope.$apply ()->
            if result.error
              $notify.error "Get an Error, Please retry it.", result.error.message
              $scope.loadFiles = off
              return
            $scope.nextPageToken = result.nextPageToken
            $scope.items.push item for item in result.items
            $scope.loadFiles = off
      $scope.setForm = (item)->
        $scope.libraryKey = item.id
        $scope.label = item.title
        $scope.desc = item.description
        $scope.sourceUrl = "https://script.google.com/d/#{item.id}/edit"
        $scope.searchDialog = off
  ]
