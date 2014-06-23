'use strict'

libraryBoxApp = angular.module('LibraryBoxApp')
libraryBoxApp.controller 'MainCtrl',
  ["$scope",'$rootScope','$state','$filter', 'storage', '$notify'
  ($scope, $rootScope, $state, $filter,storage, $notify) ->
    $scope.uploading = off
    $scope.isCollapsed = on
    $scope.currentPage = 1 #current page
    $scope.maxSize = 3 #pagination max size
    $scope.entryLimit = 20 #max rows for data table
    $scope.search = "$" : ""
    $scope.exportMode = off
    libraries = (item for item in $rootScope.libraries when !item.isExternal)
    libraries = libraries.sort (i1,i2)-> i1.label.toLowerCase() > i2.label.toLowerCase()

    $scope.glmImportOption = 
      backdropFade : yes
      dialogFade : yes
      dialogClass : "modal file-choose-modal"
      templateUrl : "views/glmImport.html"
      controller : "GlmImportCtrl"

    $rootScope.$watch 'libraries', ()->
      libraries = (item for item in $rootScope.libraries when !item.isExternal)
      libraries = libraries.sort (i1,i2)-> i1.label.toLowerCase() > i2.label.toLowerCase()
      $scope.filtered = filter()

    filter = ()->
      $filter('limitTo')(
        $filter('startFrom')(
          $filter('filter')(
            libraries,
            $scope.search
          ), ($scope.currentPage-1)*$scope.entryLimit
        ), $scope.entryLimit
      )

    $scope.filtered = filter()

    $scope.setExportMode = ()->
      $scope.exportMode = !$scope.exportMode


    $scope.$watch "search.$" , ()-> 
      $scope.filtered = filter()

    $scope.$on "deleted" , (event , key)->
      console.log key
      libraries = libraries.filter (library)-> library.key != key
      $scope.filtered = filter()

    # init pagination with $scope.list
    $scope.noOfPages = Math.ceil libraries.length / $scope.entryLimit
    $scope.setPage = (pageNo)->
        $scope.currentPage = pageNo
    $scope.$watch 'filtered' , ()->
        $scope.noOfPages = Math.ceil $scope.filtered.length / $scope.entryLimit
    $scope.uploadLibraries = ()->
      $scope.uploading = on
      storage.getLibraries().then (libraries)->
        boundary = '-------' + new Date().getTime();
        delimiter = "--#{boundary}"
        close_delim = "--#{boundary}--"

        json = JSON.stringify(libraries, "" , 2)
        metadata = 
          'title' : "gas-library-box-libraries.json"
          'mimeType' : "application/json"

        multipartRequestBody = """
#{delimiter}
Content-Type: application/json

#{JSON.stringify(metadata)}
#{delimiter}
Content-Type: application/json
Content-Transfer-Encoding: base64

#{Base64.encode(json)}
#{close_delim}
"""

        gapi.client.request(
          'path' : '/upload/drive/v2/files'
          'method' : 'POST'
          'params': 
            'uploadType': 'multipart'
          'headers':
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
          'body': multipartRequestBody
        ).execute (result)->

          $scope.$apply ()->
            $scope.uploading = off
            return $notify.error "Got Error", result.error.message if result.error
            $notify.info "Your libraries are exported", "Exported your libraries to Google Drive.<br/> Please see <a href=\"#{result.alternateLink}\" target=\"_blank\">Google Drive</a>"
    $scope.import = (fileId)->
      $scope.importing = on
      gapi.client.drive.files.get( "fileId" : fileId , "fields" : "downloadUrl").execute (result)->
        return $notify.error "Got Error", result.error.message if result.error

        $.ajax result.downloadUrl,
          headers :
            "Authorization" : "Bearer #{gapi.auth.getToken().access_token}"
        .then (result)->
          return $notify.error "Got Error", result.error.message if result.error
          storage.addLibraries(result).then ()->
            $scope.isCollapsed = on
            storage.getLibraries().then (libs)->
              libraries = (item for key, item of libs when !item.isExternal)
              libraries = libraries.sort (i1,i2)-> i1.label.toLowerCase() > i2.label.toLowerCase()
              $scope.filtered = filter()

              $notify.info "Import your libraries", "Success importing your libraries"


  ]

libraryBoxApp.controller 'PrivateLibraryCtrl',["$scope", "$window", 'storage', '$notify' ,'$state', ($scope,$window, storage, $notify, $state)->

  $scope.modify = false
  $scope.delete = false
  $scope.saving = off
  $scope.deleteLibrary = ()->
    if $window.confirm("Are you sure delete #{$scope.item.label} ?")
      storage.removeLibrary($scope.item.key).then ()->
        $notify.info "Deleted", "#{$scope.item.label} is deleted."
        $scope.$parent.$emit "deleted" , $scope.item.key
        $scope.delete = false
        $state.go "mine"
    else
      $scope.delete = false

  $scope.modifyLibs = ()->
    $scope.saving = on
    $scope.item.label = $scope.label
    $scope.item.desc = $scope.desc
    $scope.item.longDesc = $scope.longDesc
    $scope.item.modifiedAt = new Date().getTime()
    storage.addLibrary($scope.item).then ()->
      $scope.modify = false
      $scope.saving = off
  ]
