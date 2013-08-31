'use strict';

angular
.module('markdown.config', [])
.value 'markdown.config',
  gfm      : true
  tables   : true
  sanitize : true


angular.module('markdown',['markdown.config'])
  .service '$markdown',['markdown.config' ,
  class Markdown
    constructor: (config) ->
      console.log config
      marked.setOptions config

    marked : ()->
      marked.apply marked, arguments
  ]
