(function() {
  'use strict';
  var DEFAULT_API_PARAMETER;

  DEFAULT_API_PARAMETER = {
    q: "mimeType = 'application/vnd.google-apps.spreadsheet'",
    fields: "items(createdDate,defaultOpenWithLink,description,exportLinks,iconLink,id,lastModifyingUser,modifiedDate,originalFilename,owners,properties,selfLink,title,webContentLink,webViewLink),nextPageToken",
    limit: "10"
  };

  angular.module('LibraryBoxApp').controller('GlmImportCtrl', [
    '$scope', '$filter', function($scope, $filter) {
      $scope.searchQuery = {
        $: ""
      };
      $scope.items = [];
      $scope.loadFiles = true;
      gapi.client.drive.files.list(DEFAULT_API_PARAMETER).execute(function(result) {
        return $scope.$apply(function() {
          var item, _i, _len, _ref;
          $scope.state = "chooseSpreadsheet";
          if (result.error) {
            $notify.error("Get an Error, Please retry it.", result.error.message);
            $scope.loadFiles = false;
            return;
          }
          console.log(result.nextPageToken);
          $scope.nextPageToken = result.nextPageToken;
          _ref = result.items;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            $scope.items.push(item);
          }
          return $scope.loadFiles = false;
        });
      });
      $scope.nextPage = function() {
        if (!$scope.nextPageToken || $scope.loadFiles) {
          return;
        }
        $scope.loadFiles = true;
        return gapi.client.drive.files.list(angular.extend(DEFAULT_API_PARAMETER, {
          pageToken: $scope.nextPageToken
        })).execute(function(result) {
          return $scope.$apply(function() {
            var item, _i, _len, _ref;
            if (result.error) {
              $notify.error("Get an Error, Please retry it.", result.error.message);
              $scope.loadFiles = false;
              return;
            }
            $scope.nextPageToken = result.nextPageToken;
            _ref = result.items;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              item = _ref[_i];
              $scope.items.push(item);
            }
            return $scope.loadFiles = false;
          });
        });
      };
      $scope.loadSheet = function(current) {
        var token;
        if (current == null) {
          return;
        }
        $scope.state = "loading";
        token = gapi.auth.getToken().access_token;
        $scope.searchQuery = {
          $: ""
        };
        return $.ajax("https://spreadsheets.google.com/feeds/worksheets/" + current.id + "/private/full?v=3.0&access_token=" + token + "&alt=json-in-script&prettyprint=true", {
          crossDomain: true,
          dataType: 'jsonp',
          type: "GET"
        }).done(function(result) {
          $scope.id = current.id;
          $scope.state = "chooseSheet";
          $scope.items = result.feed.entry;
          $scope.ssName = result.feed.title.$t;
          return $scope.$apply();
        });
      };
      $scope.loadLibrary = function(sheet) {
        var id, splits, token;
        if (sheet == null) {
          return;
        }
        splits = sheet.id.$t.split("/");
        id = splits[splits.length - 1];
        $scope.state = "loading";
        token = gapi.auth.getToken().access_token;
        $scope.searchQuery = {
          $: ""
        };
        return $.ajax("https://spreadsheets.google.com/feeds/list/" + $scope.id + "/" + id + "/private/full?v=3.0&access_token=" + token + "&alt=json-in-script&prettyprint=true", {
          crossDomain: true,
          dataType: 'jsonp',
          type: "GET"
        }).done(function(result) {
          console.log(result);
          return $scope.$apply(function() {
            var value;
            if (result.error) {
              $scope.state = "chooseSheet";
              return;
            }
            $scope.state = "chooseLibraries";
            return $scope.loadedLibraries = (function() {
              var _i, _len, _ref, _results;
              _ref = result.feed.entry;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                value = _ref[_i];
                if (value.gsx$libraryid.$t) {
                  _results.push({
                    key: value.gsx$libraryid.$t,
                    title: value.gsx$librarykey.$t,
                    selected: true
                  });
                }
              }
              return _results;
            })();
          });
        });
      };
      $scope.checkAll = function($event) {
        var filter, library, _i, _len, _ref;
        $event.preventDefault();
        filter = $filter('filter');
        _ref = filter($scope.loadedLibraries, $scope.searchQuery);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          library = _ref[_i];
          library.selected = true;
        }
        return false;
      };
      $scope.reverseAll = function($event) {
        var filter, library, _i, _len, _ref;
        $event.preventDefault();
        filter = $filter('filter');
        _ref = filter($scope.loadedLibraries, $scope.searchQuery);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          library = _ref[_i];
          library.selected = !library.selected;
        }
        return false;
      };
      return $scope.uncheckAll = function($event) {
        var filter, library, _i, _len, _ref;
        $event.preventDefault();
        filter = $filter('filter');
        _ref = filter($scope.loadedLibraries, $scope.searchQuery);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          library = _ref[_i];
          library.selected = false;
        }
        return false;
      };
    }
  ]);

}).call(this);
