'use strict'

describe 'Controller: AddlibraryCtrl', () ->

  # load the controller's module
  beforeEach module 'libraryBoxApp'

  AddlibraryCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    AddlibraryCtrl = $controller 'AddlibraryCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', () ->
    expect(scope.awesomeThings.length).toBe 3
