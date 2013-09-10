'use strict'

describe 'Filter: startFrom', () ->

  # load the filter's module
  beforeEach module 'LibraryBoxApp'

  # initialize a new instance of the filter before each test
  startFrom = {}
  beforeEach inject ($filter) ->
    startFrom = $filter 'startFrom'

  it 'should return the input prefixed with "startFrom filter:"', () ->
    text = 'angularjs'
    expect(startFrom text).toBe ('startFrom filter: ' + text)
