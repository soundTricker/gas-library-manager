'use strict'

describe 'Service: markdown', () ->

  # load the service's module
  beforeEach module 'LibraryBoxApp'

  # instantiate service
  markdown = {}
  beforeEach inject (_markdown_) ->
    markdown = _markdown_

  it 'should do something', () ->
    expect(!!markdown).toBe true
