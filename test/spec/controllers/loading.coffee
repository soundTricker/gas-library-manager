'use strict'

describe 'Controller: LoadingCtrl', () ->

  # load the controller's module
  beforeEach module 'LibraryBoxApp'

  LoadingCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    LoadingCtrl = $controller 'LoadingCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', () ->
    expect(scope.awesomeThings.length).toBe 3
