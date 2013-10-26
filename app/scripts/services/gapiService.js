(function() {
  'use strict';
  var GapiService;

  angular.module('LibraryBoxApp').service('$gapi', [
    '$q', GapiService = (function() {
      function GapiService($q) {
        this.$q = $q;
      }

      return GapiService;

    })()
  ]);

}).call(this);
