'use strict'

describe 'Controller: GlmimportCtrl', () ->

  # load the controller's module
  beforeEach module 'libraryBoxApp'

  GlmimportCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    GlmimportCtrl = $controller 'GlmimportCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', () ->
    expect(scope.awesomeThings.length).toBe 3
