'use strict'

describe 'Controller: PublishCtrl', () ->

  # load the controller's module
  beforeEach module 'LibraryBoxApp'

  PublishCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    PublishCtrl = $controller 'PublishCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', () ->
    expect(scope.awesomeThings.length).toBe 3
