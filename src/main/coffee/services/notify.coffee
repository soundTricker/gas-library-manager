'use strict';

angular.module('LibraryBoxApp')
  .service '$notify',
    [
      'notify'
      class NotifyService

        constructor : (@notify)->
          @template = "views/notify.html"

        show : (title, message, type)=>
          @notify 
            message : message
            template : @template
            scope :
              title : title
              type : if type then "alert-#{type}" else ""

        info :(title, message)=> @show title, message, "info"
        success :(title, message)=> @show title, message, "success"
        error :(title, message)=> @show title, message, "error"
        warn :(title, message)=> @show title, message, "warnning"
    ]