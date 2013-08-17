'use strict'

describe 'Filter: br', () ->

  # load the filter's module
  beforeEach module 'gasLibrarySearcherApp'

  # initialize a new instance of the filter before each test
  br = {}
  beforeEach inject ($filter) ->
    br = $filter 'br'

  it 'should return the input prefixed with "br filter:"', () ->
    text = 'angularjs'
    expect(br text).toBe ('br filter: ' + text);
