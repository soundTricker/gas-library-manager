(function() {
  'use strict';
  var Markdown;

  angular.module('markdown.config', []).value('markdown.config', {
    gfm: true,
    tables: true,
    sanitize: true
  });

  angular.module('markdown', ['markdown.config']).service('$markdown', [
    'markdown.config', Markdown = (function() {
      function Markdown(config) {
        marked.setOptions(config);
      }

      Markdown.prototype.marked = function() {
        return marked.apply(marked, arguments);
      };

      return Markdown;

    })()
  ]);

}).call(this);
