'use strict'

describe 'Controller: ModifyaccountCtrl', () ->

  # load the controller's module
  beforeEach module 'LibraryBoxApp'

  ModifyaccountCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    ModifyaccountCtrl = $controller 'ModifyaccountCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', () ->
    expect(scope.awesomeThings.length).toBe 3
