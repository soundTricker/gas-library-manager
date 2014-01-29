angular.module('LibraryBoxApp', ['ui.bootstrap', 'ui.directives'])
  .run(["$rootScope", ($rootScope)->
    $rootScope.i18n = (key, args...)->
      if args.length > 0
        chrome.i18n.getMessage.apply chrome.i18n, [key].concat(args)
      else
        chrome.i18n.getMessage.apply chrome.i18n, [key]
  ])
  .controller "popup",
  [
    "$scope","storage",'$filter',
    class PopupCtrl
      constructor : (@$scope, @storage,@$filter)->
        @search = {$:""}
        @currentPage = 1 #current page
        @$scope.maxSize = 3 #pagination max size
        @$scope.entryLimit = 3 #max rows for data table
        @libraries = @storage.getLibrariesSync()
        @limitTo = @$filter('limitTo')
        @startFrom = @$filter('startFrom')
        @filter = @$filter('filter')

        @filtered = @chainFilter()
        @noOfPages = Math.ceil @filtered.length / @$scope.entryLimit

        @$scope.$watch "ctrl.search.$" , ()=> 
          @filtered = @chainFilter()
        @$scope.$watch "ctrl.currentPage", ()=> 
          @filtered = @chainFilter()


        @$scope.$watch "ctrl.filtered", ()=> 
          @$scope.noOfPages = Math.ceil @filter(@libraries,@search).length / @$scope.entryLimit
        @$scope.setPage = (pageNo)=> @currentPage = pageNo


      showOptionPage : ()-> chrome.runtime.sendMessage action : "showOptionPage"
      showMyLibrariesPage : (key)-> chrome.runtime.sendMessage {action : "showMyLibraryPage", key : key}
      chainFilter : ()=>
        @limitTo( @startFrom( @filter(@libraries,@search), (@currentPage-1) * @$scope.entryLimit), @$scope.entryLimit)
      
  ]

