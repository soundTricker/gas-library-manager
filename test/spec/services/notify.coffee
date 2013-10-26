'use strict'

describe 'Service: notify', () ->

  # load the service's module
  beforeEach module 'LibraryBoxApp'

  # instantiate service
  notify = {}
  beforeEach inject (_notify_) ->
    notify = _notify_

  it 'should do something', () ->
    expect(!!notify).toBe true
