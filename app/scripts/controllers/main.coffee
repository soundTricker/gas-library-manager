'use strict'

angular.module('LibraryBoxApp')
  .controller 'MainCtrl', ($scope) ->
    chrome.storage.onChanged.addListener (changes, areaName)->
      return if areaName != "sync"

      $scope.$apply ()->
        $scope.libraries = (item for key, item of (changes?.libraries?.newValue || {}) when item.key)
        console.log $scope.libraries

    chrome.storage.sync.get "libraries" , (res)->
      $scope.$apply ()->
        $scope.libraries = (item for key, item of (res?.libraries || {}) when item.key)

    $scope.deleteLibrary = (item,libraryRow)->
      chrome.storage.sync.get "libraries" , (res)->
        libraries = res?.libraries || {}
        libraries[item.key] = undefined
        chrome.storage.sync.set {"libraries" : libraries} , ()->
          alert "deleted"

    $scope.modifyLibs = (modifyLibrary, item, modify)->
      item.label = modifyLibrary.label
      item.desc = modifyLibrary.desc
      modify = false
      chrome.storage.sync.get "libraries" , (res)->
        libraries = res?.libraries || {}
        libraries[item.key] = item
        chrome.storage.sync.set {"libraries" : libraries} , ()->
          alert "modified"




