melcase: false

# Generated on 2013-08-05 using generator-chrome-extension 0.2.3
"use strict"
mountFolder = (connect, dir) ->
  connect.static require("path").resolve(dir)


# # Globbing
# for performance reasons we're only matching one level down:
# 'test/spec/{,*/}*.js'
# use this if you want to recursively match all subfolders:
# 'test/spec/**/*.js'
module.exports = (grunt) ->

  # load all grunt tasks
  require("matchdep").filterDev("grunt-*").forEach grunt.loadNpmTasks

  # configurable paths
  yeomanConfig =
    src: "src/main"
    app: "app"
    dist: "dist"
  grunt.initConfig
    yeoman: yeomanConfig
    watch:
      jade:
        files: ["<%= yeoman.src %>/jade/{,*/}*.jade"]
        tasks: ["jade:local"]

      gruntfile:
        files: ["Gruntfile.coffee"]

      coffee:
        files: ["<%= yeoman.src %>/coffee/{,*/}*.coffee"]
        tasks: ["coffee:dist"]

      coffeeTest:
        files: ["test/spec/{,*/}*.coffee"]
        tasks: ["coffee:test"]

      compass:
        files: ["<%= yeoman.src %>/sass/{,*/}*.{scss,sass}"]
        tasks: ["compass:server"]

      livereload:
        options:
          livereload: "<%= connect.options.livereload %>"
        files: ["<%= yeoman.app%>/{,*/}*"]
        tasks: []

    connect:
      options:
        port: 9000
        livereload: 35730

        # change this to '0.0.0.0' to access the server from outside
        hostname: "localhost"
      livereload:
        options:
          open: true
          base: [
            ".tmp"
            "<%= yeoman.app %>"
          ]
      keepalive:
        options:
          keepalive:on
          livereload:on
          middleware: (connect)->
            [mountFolder(connect, "app")]

      test:
        options:
          middleware: (connect) ->
            [mountFolder(connect, ".tmp"), mountFolder(connect, "test")]

    clean:
      dist:
        files: [
          dot: true
          src: [".tmp", "<%= yeoman.dist %>/*", "!<%= yeoman.dist %>/.git*"]
        ]

      server: ".tmp"

    jasmine:
      all:
        options:
          specs: "test/spec/{,*/}*.js"

    coffee:
      dist:
        files: [
          expand: true
          cwd: "<%= yeoman.src %>/coffee"
          src: "{,*/}*.coffee"
          dest: "<%= yeoman.app %>/scripts"
          ext: ".js"
        ]

      test:
        files: [
          expand: true
          cwd: "test/spec"
          src: "{,*/}*.coffee"
          dest: ".tmp/spec"
          ext: ".js"
        ]

    compass:
      options:
        sassDir: "<%= yeoman.src %>/sass"
        cssDir: "<%= yeoman.app %>/styles"
        generatedImagesDir: ".tmp/images/generated"
        imagesDir: "<%= yeoman.app %>/images"
        javascriptsDir: "<%= yeoman.app %>/scripts"
        fontsDir: "<%= yeoman.app %>/styles/fonts"
        importPath: "<%= yeoman.app %>/bower_components"
        httpImagesPath: "/images"
        httpGeneratedImagesPath: "/images/generated"
        relativeAssets: false

      dist: {}
      server:
        options:
          debugInfo: true
    jade:
      local:
          options:
            pretty: on
            data :
              livereload:on
              port : "<%= connect.options.livereload% >"
          files: [
            expand: true
            cwd: "<%= yeoman.src %>/jade"
            src: "{,*/}*.jade"
            dest: "<%= yeoman.app %>/"
            ext: ".html"
          ]
      dist:
          options:
            pretty: on
          files: [
            expand: true
            cwd: "<%= yeoman.src %>/jade"
            src: "{,*/}*.jade"
            dest: "<%= yeoman.app %>/"
            ext: ".html"
          ]


    # not used since Uglify task does concat,
    # but still available if needed
    #concat: {
    #            dist: {}
    #        },

    # not enabled since usemin task does concat and uglify
    # check index.html to edit your build targets
    # enable this task if you prefer defining your build targets here
    #uglify: {
    #            dist: {}
    #        },
    useminPrepare:
      options:
        dest: "<%= yeoman.dist %>"

      html: ["<%= yeoman.app %>/popup.html", "<%= yeoman.app %>/options.html"]

    usemin:
      options:
        dirs: ["<%= yeoman.dist %>"]

      html: ["<%= yeoman.dist %>/{,*/}*.html"]
      css: ["<%= yeoman.dist %>/styles/{,*/}*.css"]

    imagemin:
      dist:
        files: [
          expand: true
          cwd: "<%= yeoman.app %>/images"
          src: "{,*/}*.{png,jpg,jpeg}"
          dest: "<%= yeoman.dist %>/images"
        ]

    svgmin:
      dist:
        files: [
          expand: true
          cwd: "<%= yeoman.app %>/images"
          src: "{,*/}*.svg"
          dest: "<%= yeoman.dist %>/images"
        ]

    cssmin:
      dist:
        files:
          "<%= yeoman.dist %>/styles/main.css": [".tmp/styles/{,*/}*.css", "<%= yeoman.app %>/styles/{,*/}*.css"]

    htmlmin:
      dist:
        options: {}

        #removeCommentsFromCDATA: true,
        #                    // https://github.com/yeoman/grunt-usemin/issues/44
        #                    //collapseWhitespace: true,
        #                    collapseBooleanAttributes: true,
        #                    removeAttributeQuotes: true,
        #                    removeRedundantAttributes: true,
        #                    useShortDoctype: true,
        #                    removeEmptyAttributes: true,
        #                    removeOptionalTags: true
        files: [
          expand: true
          cwd: "<%= yeoman.app %>"
          src: "*.html"
          dest: "<%= yeoman.dist %>"
        ]


    # Put files not handled in other tasks here
    copy:
      dist:
        files: [
          expand: true
          dot: true
          cwd: "<%= yeoman.app %>"
          dest: "<%= yeoman.dist %>"
          src: ["*.{ico,png,txt}","views/{,*/}*.html","app/bower_components/jquery-ui/themes/base/images/*", "images/{,*/}*.{webp,gif}", "_locales/{,*/}*.json"]
        ,
          expand: true
          flatten: true
          cwd: "<%= yeoman.app %>"
          dest: "<%= yeoman.dist %>/font"
          src: ["bower_components/font-awesome/font/*"]
        ,
          expand: true
          cwd: ".tmp/images"
          dest: "<%= yeoman.dist %>/images"
          src: ["generated/*"]
        ,
          expand: true
          cwd: "<%= yeoman.app %>"
          dest: "<%= yeoman.dist %>"
          src: ["scripts/background.js","scripts/analytics.js"]
        ]

    concurrent:
      server: ["coffee:dist", "compass:server"]
      test: ["coffee", "compass"]
      dist: ["coffee","jade:dist", "compass:dist", "imagemin", "svgmin", "htmlmin"]

    chromeManifest:
      dist:
        options:
          buildnumber: off

        src: "<%= yeoman.app %>"
        dest: "<%= yeoman.dist %>"

    compress:
      dist:
        options:
          archive: "package/gas-library-box.zip"

        files: [
          expand: true
          cwd: "dist/"
          src: ["**"]
          dest: ""
        ]

  grunt.registerTask "serve" , (target)=>
    if target is "dist"
      return grunt.task.run [
        "build"
        "connect:dist:keepalive"
      ]
    grunt.task.run [
      "clean:server"
      "concurrent:server"

      "connect:livereload"
      "watch"
    ]


  grunt.registerTask "test", ["clean:server", "concurrent:test", "connect:test", "jasmine"]
  grunt.registerTask "build", ["clean:dist", "chromeManifest:dist", "useminPrepare", "concurrent:dist", "cssmin", "concat", "uglify", "copy", "usemin", "compress"]
  grunt.registerTask "default", ["test", "build"]
