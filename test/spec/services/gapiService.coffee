'use strict'

describe 'Service: gapiService', () ->

  # load the service's module
  beforeEach module 'LibraryBoxApp'

  # instantiate service
  gapiService = {}
  beforeEach inject (_gapiService_) ->
    gapiService = _gapiService_

  it 'should do something', () ->
    expect(!!gapiService).toBe true
