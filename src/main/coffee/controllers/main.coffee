'use strict'

libraryBoxApp = angular.module('LibraryBoxApp')
libraryBoxApp.controller 'MainCtrl',["$scope" ,($scope) ->
  chrome.storage.onChanged.addListener (changes, areaName)->
    return if areaName != "sync"

    $scope.libraries = (item for key, item of (changes?.libraries?.newValue || {}) when item.key)
    $scope.$apply()

  chrome.storage.sync.get "libraries" , (res)->
    $scope.libraries = (item for key, item of (res?.libraries || {}) when item.key)
    $scope.$apply()
]

libraryBoxApp.controller 'PrivateLibraryCtrl',["$scope", "$window", ($scope,$window)->
    $scope.modify = false
    $scope.delete = false
    $scope.deleteLibrary = ()->
      if $window.confirm("Are you sure delete #{$scope.item.label} ?")
        chrome.storage.sync.get "libraries" , (res)->
          libraries = res?.libraries || {}
          libraries[$scope.item.key] = undefined
          chrome.storage.sync.set {"libraries" : libraries} , ()->
            alert "deleted"
            $scope.$apply ()->
              $scope.delete = false
      else
        $scope.delete = false

    $scope.modifyLibs = ()->
      $scope.item.label = $scope.label
      $scope.item.desc = $scope.desc
      $scope.item.longDesc = $scope.longDesc
      $scope.item.modifiedAt = new Date().getTime()
      chrome.storage.sync.get "libraries" , (res)->
        libraries = res?.libraries || {}
        libraries[$scope.item.key] = $scope.item
        chrome.storage.sync.set {"libraries" : libraries} , ()->
          $scope.$apply ()->
            $scope.modify = false
  ]
