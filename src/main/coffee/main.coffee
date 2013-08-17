'use strict'

libraryBoxApp = angular.module('LibraryBoxApp')
libraryBoxApp.controller 'MainCtrl', ($scope) ->
  chrome.storage.onChanged.addListener (changes, areaName)->
    return if areaName != "sync"

    $scope.libraries = (item for key, item of (changes?.libraries?.newValue || {}) when item.key)
    $scope.$apply()

  chrome.storage.sync.get "libraries" , (res)->
    $scope.libraries = (item for key, item of (res?.libraries || {}) when item.key)
    $scope.$apply()


libraryBoxApp.controller 'PrivateLibraryCtrl', ($scope)->
  $scope.modify = false
  $scope.deleteLibrary = ()->
    chrome.storage.sync.get "libraries" , (res)->
      libraries = res?.libraries || {}
      libraries[$scope.item.key] = undefined
      chrome.storage.sync.set {"libraries" : libraries} , ()->
        alert "deleted"

  $scope.modifyLibs = ()->
    $scope.item.label = $scope.label
    $scope.item.desc = $scope.desc
    chrome.storage.sync.get "libraries" , (res)->
      libraries = res?.libraries || {}
      libraries[item.key] = item
      chrome.storage.sync.set {"libraries" : libraries} , ()->
        $scope.modify = false
