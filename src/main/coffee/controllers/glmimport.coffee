'use strict'

DEFAULT_API_PARAMETER = 
  q : "mimeType = 'application/vnd.google-apps.spreadsheet'"
  fields : "items(createdDate,defaultOpenWithLink,description,exportLinks,iconLink,id,lastModifyingUser,modifiedDate,originalFilename,owners,properties,selfLink,title,webContentLink,webViewLink),nextPageToken"
  limit : "10"


angular.module('LibraryBoxApp')
  .controller 'GlmImportCtrl', 
    ['$scope','$filter'
     ($scope , $filter) ->
        $scope.searchQuery = $ : ""
        $scope.items = []
        $scope.loadFiles = on
        gapi.client.drive.files
        .list(DEFAULT_API_PARAMETER)
        .execute (result)->
          $scope.$apply ()->
            $scope.state = "chooseSpreadsheet"
            if result.error
              $notify.error "Get an Error, Please retry it.", result.error.message
              $scope.loadFiles = off
              return
            console.log result.nextPageToken
            $scope.nextPageToken = result.nextPageToken
            $scope.items.push item for item in result.items
            $scope.loadFiles = off

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
        $scope.loadSheet = (current)->
          return if !current?
          $scope.state = "loading"
          token = gapi.auth.getToken().access_token
          $scope.searchQuery = $ : ""

          $.ajax(
            "https://spreadsheets.google.com/feeds/worksheets/#{current.id}/private/full?v=3.0&access_token=#{token}&alt=json-in-script&prettyprint=true",
            crossDomain : true
            dataType: 'jsonp'
            type : "GET"
          ).done (result)->
            $scope.id = current.id
            $scope.state = "chooseSheet"
            $scope.items = result.feed.entry
            $scope.ssName = result.feed.title.$t
            $scope.$apply()
        $scope.loadLibrary = (sheet)->

          return if !sheet?

          splits = sheet.id.$t.split("/")

          id = splits[splits.length - 1]
          $scope.state = "loading"
          token = gapi.auth.getToken().access_token
          $scope.searchQuery = $ : ""
          $.ajax(
            "https://spreadsheets.google.com/feeds/list/#{$scope.id}/#{id}/private/full?v=3.0&access_token=#{token}&alt=json-in-script&prettyprint=true",
            crossDomain : true
            dataType: 'jsonp'
            type : "GET"
          ).done (result)->
            console.log result
            $scope.$apply ()->
              if result.error
                $scope.state = "chooseSheet"
                return
              $scope.state = "chooseLibraries"
              $scope.loadedLibraries = ({key : value.gsx$libraryid.$t, title : value.gsx$librarykey.$t, selected : on} for value in result.feed.entry when value.gsx$libraryid.$t)
        $scope.checkAll = ($event)->
          $event.preventDefault()
          filter = $filter('filter')
          for library in filter($scope.loadedLibraries, $scope.searchQuery)
            library.selected = on
          return false

        $scope.reverseAll = ($event)->
          $event.preventDefault()
          filter = $filter('filter')
          for library in filter($scope.loadedLibraries, $scope.searchQuery)
            library.selected = !library.selected
          return false

        $scope.uncheckAll = ($event)->
          $event.preventDefault()
          filter = $filter('filter')
          for library in filter($scope.loadedLibraries, $scope.searchQuery)
            library.selected = off
          return false


        # gapi.client.request(
        #   root : "https://spreadsheets.google.com/feeds"
        #   path : "/worksheets/0AmftUjoJgST5dHA4NmZBVWZubXIwSlFWSGl5NWVfc0E/private/full"
        #   headers : 
        #     "GData-Version" : "v3"
        #   callback : ()-> console.log arguments
        # )



    ]
