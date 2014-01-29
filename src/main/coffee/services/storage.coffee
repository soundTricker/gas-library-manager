'use strict';

angular.module('LibraryBoxApp')
  .service 'storage', ['$rootScope','$q',
  class Storage
    constructor:(@$rootScope, @$q)->
      chrome.storage.onChanged.addListener (changes, areaName)=>
        return if areaName != "local"
        @$rootScope.$digest "addLibrary" ,
          changes : changes
        @libraryMap = changes.libraries.newValue
        @libraries = (item for key, item of (changes?.libraries?.newValue || {}) when item.key)
        @$rootScope.libraries = @libraries
        $rootScope.$apply()

    getLibrary:(libraryKey)=>
      d = @$q.defer()
      if @libraryMap
        d.resolve angular.copy @libraryMap[libraryKey]
      else
        @getLibraries().then (libraries)=>
          d.resolve angular.copy libraries[libraryKey]
      d.promise

    getLibraries:()=>

      d = @$q.defer()

      chrome.storage.local.get "libraries" , (res)=>
        @libraryMap = res?.libraries || {}
        @libraries = (item for key, item of @libraryMap when item.key)
        @$rootScope.$apply ()=> d.resolve angular.copy @libraryMap
      d.promise

    getLibrariesSync:()->
      ret = []
      @getLibraries().then (res)=>
        ret.push i for i in @libraries
      return ret

    addLibrary:(library)=>
      d = @$q.defer()
      @getLibraries().then (libraries)=>
        libraries[library.key || library.libraryKey] = library
        chrome.storage.local.set {"libraries" : libraries},()=>
          @$rootScope.$apply ()-> d.resolve angular.copy libraries
      d.promise

    addLibraries:(libraryMap)=>
      d = @$q.defer()
      @getLibraries().then (libraries)=>
        libraries[key] = library for key, library of libraryMap
        chrome.storage.local.set {"libraries" : libraries}, ()=>
          d.resolve angular.copy libraries


    removeLibrary:(libraryKey)=>
      d = @$q.defer()
      @getLibraries().then (libraries)=>
        libraries[libraryKey] = undefined
        chrome.storage.local.set {"libraries" : libraries},()=>
          @$rootScope.$apply ()-> d.resolve libraries

      d.promise

  ]