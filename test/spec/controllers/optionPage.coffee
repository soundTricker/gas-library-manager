'use strict'

describe 'Controller: OptionpageCtrl', () ->

  # load the controller's module
  beforeEach module 'LibraryBoxApp'

  OptionpageCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    OptionpageCtrl = $controller 'OptionpageCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', () ->
    expect(scope.awesomeThings.length).toBe 3;
