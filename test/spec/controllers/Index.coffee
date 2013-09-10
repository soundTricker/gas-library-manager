'use strict'

describe 'Controller: IndexCtrl', () ->

  # load the controller's module
  beforeEach module 'LibraryBoxApp'

  IndexCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    IndexCtrl = $controller 'IndexCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', () ->
    expect(scope.awesomeThings.length).toBe 3
