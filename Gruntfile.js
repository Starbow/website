/**
 * Generates, minifies, beautifies, etc. CSS and Javascript files which are placed in the "public" folder.
 */
'use strict';

var path = require("path");

var OPTIMIZE_JAVASCRIPT = true
  , OPTIMIZE_CSS = true
  , SERVER_SIDE_VIEW_FILES = path.normalize(__dirname + "/server/mvc/views")
  , ASSETS_SOURCE_FOLDER = path.normalize(__dirname + "/private/assets")
  , ASSETS_DESTINATION_FOLDER = path.normalize(__dirname + "/public/assets");

module.exports = function(grunt){
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-react');

  var config = {
    // LESS
    less: {
      "/assets/framework/bootstrap/themes/starbow.less": {
        options: {
          compress: OPTIMIZE_CSS,
          watchFiles: [
            ASSETS_SOURCE_FOLDER + "/framework/bootstrap/themes/starbow.less",
            ASSETS_SOURCE_FOLDER + "/framework/bootstrap/themes/starbow/**/*.less",
          ],
        },
        files: [{
          src: [
            ASSETS_SOURCE_FOLDER + "/framework/bootstrap/themes/starbow.less"
          ],
          dest: ASSETS_DESTINATION_FOLDER + "/framework/bootstrap/themes/starbow.css"
        }],
      },
      "/assets/layout/default.less": {
        options: {
          compress: OPTIMIZE_CSS,
          watchFiles: [
            ASSETS_SOURCE_FOLDER + "/layout/default.less",
            ASSETS_SOURCE_FOLDER + "/layout/default/**/*.less",
          ],
        },
        files: [{
          src: [
            ASSETS_SOURCE_FOLDER + "/layout/default.less"
          ],
          dest: ASSETS_DESTINATION_FOLDER + "/layout/default.css"
        }],
      },
      "/assets/application/*/**.less": {
        options: {
          compress: OPTIMIZE_CSS,
          watchFiles: [
            ASSETS_SOURCE_FOLDER + "/application/*.less",
            ASSETS_SOURCE_FOLDER + "/application/**/*.less"
          ],
        },
        files: [{
          expand: true,
          cwd: ASSETS_SOURCE_FOLDER + "/application",
          src: [
            "*.less",
            "**/*.less"
          ],
          ext: ".css",
          dest: ASSETS_DESTINATION_FOLDER + "/application"
        }],
      }
    },
    // Javascript
    uglify: {
      "/assets/common/App.src.js": {
        options: {
          beautify: !OPTIMIZE_JAVASCRIPT,
          watchFiles: [
            ASSETS_SOURCE_FOLDER + "/common/App.src.js",
            ASSETS_SOURCE_FOLDER + "/common/App/**/*.src.js",
          ],
        },
        files: [{
          src: [
            ASSETS_SOURCE_FOLDER + "/common/App.src.js",
          ],
          dest: ASSETS_DESTINATION_FOLDER + "/common/App.js"
        }]
      },
      "/assets/application/*/**.src.js": {
        options: {
          beautify: !OPTIMIZE_JAVASCRIPT,
          mangle: OPTIMIZE_JAVASCRIPT,
          watchFiles: [
            ASSETS_SOURCE_FOLDER + "/application/*.src.js",
            ASSETS_SOURCE_FOLDER + "/application/**/*.src.js",
          ],
        },
        files: [{
          expand: true,
          cwd: ASSETS_SOURCE_FOLDER + "/application",
          src: [
            "*.src.js",
            "**/*.src.js"
          ],
          ext: ".js",
          dest: ASSETS_DESTINATION_FOLDER + "/application"
        }]
      },
    },
    // React view files
    react: {
      "/server/mvc/views": {
        options: {
          watchFiles: [
            SERVER_SIDE_VIEW_FILES + "/*.src.jsx",
            SERVER_SIDE_VIEW_FILES + "/**/*.src.jsx",
          ],
        },
        files: [
          {
            expand: true,
            cwd: SERVER_SIDE_VIEW_FILES,
            src: ['**/*.src.jsx'],
            dest: SERVER_SIDE_VIEW_FILES,
            ext: '.jsx'
          }
        ]
      }
    }
  };
  grunt.initConfig(config);

  var defaultTasks = [];
  for (var taskId in config) {
    defaultTasks.push(taskId);
  }
  var tasks = defaultTasks.slice(0);

  var less = grunt.option('less')
    , js = grunt.option('js')
    , views = grunt.option('views');

  if (less || js || views) {
    tasks = [];
    if (less) tasks.push("less");
    if (js) tasks.push("uglify");
    if (views) tasks.push("react");
  }

  grunt.registerTask('default', tasks);
  grunt.registerTask('compile', tasks);
  grunt.registerTask('daemon', function(){
    var watchConfig = {};
    var config = grunt.config.get();
    for (var i in tasks) {
      var taskId = tasks[i];
      var subTasks = config[taskId];
      for (var subTaskId in subTasks) {
        if (typeof(config[taskId][subTaskId].options) == 'object'
          && typeof(config[taskId][subTaskId].options.watchFiles) == 'object') {
          var taskName = taskId+":"+subTaskId;
          watchConfig[taskName] = {
            files: config[taskId][subTaskId].options.watchFiles,
            tasks: [taskName]
          };
        }
      }
    }
    watchConfig.options = {
      spawn: false,
      interrupt: true,
    };
    grunt.config('watch', watchConfig);
    grunt.task.run('watch');
  });
};
