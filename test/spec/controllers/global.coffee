'use strict'

describe 'Controller: GlobalCtrl', () ->

  # load the controller's module
  beforeEach module 'LibraryBoxApp'

  GlobalCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    GlobalCtrl = $controller 'GlobalCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', () ->
    expect(scope.awesomeThings.length).toBe 3
