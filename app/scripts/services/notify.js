(function() {
  'use strict';
  var NotifyService,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('LibraryBoxApp').service('$notify', [
    'notify', NotifyService = (function() {
      function NotifyService(notify) {
        this.notify = notify;
        this.warn = __bind(this.warn, this);
        this.error = __bind(this.error, this);
        this.success = __bind(this.success, this);
        this.info = __bind(this.info, this);
        this.show = __bind(this.show, this);
        this.template = "views/notify.html";
      }

      NotifyService.prototype.show = function(title, message, type) {
        return this.notify({
          message: message,
          template: this.template,
          scope: {
            title: title,
            type: type ? "alert-" + type : ""
          }
        });
      };

      NotifyService.prototype.info = function(title, message) {
        return this.show(title, message, "info");
      };

      NotifyService.prototype.success = function(title, message) {
        return this.show(title, message, "success");
      };

      NotifyService.prototype.error = function(title, message) {
        return this.show(title, message, "error");
      };

      NotifyService.prototype.warn = function(title, message) {
        return this.show(title, message, "warnning");
      };

      return NotifyService;

    })()
  ]);

}).call(this);
