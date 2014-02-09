'use strict'

angular.module('LibraryBoxApp')
  .controller 'AddLibraryCtrl', [
    '$scope','storage','$notify','$state'
    ($scope, storage, $notify, $state) ->
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

  ]
