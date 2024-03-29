// Generated on 2015-11-22 using generator-angular-heroku 0.0.2
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  //Heroku Settings
  var pkg = grunt.file.readJSON('package.json');
  var herokuAppName = pkg.name.replace(/[^a-z0-9]/gi, '');

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({
    // Project settings
    yeoman: appConfig,
    
    //Heroku Settings
    mkdir: {
      heroku: {
        options: {
          create: ['heroku']
        },
      },
    },

    //Heroku Settings
    'file-creator': {
        heroku: {
            files: [{
                //Create Procfile required by Heroku
                file: 'heroku/Procfile',
                method: function(fs, fd, done) {  
                    fs.writeSync(fd, 'web: node server.js');
                    done();
                }
            }, {
                //Create package.json for Heroku for adding dependencies (ExpressJS)
                file: 'heroku/package.json',
                method: function(fs, fd, done) {
                    var min = grunt.option('min');
                    fs.writeSync(fd, '{\n');
                    fs.writeSync(fd, '  "name": ' + (pkg.name ? '"' + pkg.name + '"' : '""') + ',\n');
                    fs.writeSync(fd, '  "version": ' + (pkg.version ? '"' + pkg.version + '"' : '""') + ',\n');
                    fs.writeSync(fd, '  "description": ' + (pkg.description ? '"' + pkg.description + '"' : '""') + ',\n');
                    fs.writeSync(fd, '  "main": "server.js",\n');
                    fs.writeSync(fd, '  "dependencies": {\n');
                    fs.writeSync(fd, '    "express": "3.*"');
                    if (min) {
                        fs.writeSync(fd, '\n');
                    } else {
                        fs.writeSync(fd, ',\n    "bower": "^1.3"\n');
                    }
                    fs.writeSync(fd, '  },\n');
                    fs.writeSync(fd, '  "scripts": {\n');
                    fs.writeSync(fd, '    "start": "node server.js"');
                    if (min) {
                        fs.writeSync(fd, '\n');
                    } else {
                        fs.writeSync(fd, ',\n    "postinstall": "bower install"\n');
                    }
                    fs.writeSync(fd, '  },\n');
                    fs.writeSync(fd, '  "author": ' + (pkg.author ? '"' + pkg.author + '"' : '""') + ',\n');
                    fs.writeSync(fd, '  "license": ' + (pkg.license ? '"' + pkg.license + '"' : '""') + '\n');
                    fs.writeSync(fd, '}');
                    done();
                }
            }, {
                //Create server.js used by ExpressJS within Heroku
                file: 'heroku/server.js',
                method: function(fs, fd, done) {
                    var useAuth = false;
                    fs.writeSync(fd, 'var express = require("express");\n');
                    fs.writeSync(fd, 'var app = express();\n');
                    if (useAuth) {
                        var userName = 'test';
                        var password = 'password1';
                        fs.writeSync(fd, 'app.use(express.basicAuth("' + userName + '", "' + password + '"));\n');
                    }
                    fs.writeSync(fd, 'app.use(express.static(__dirname));\n');
                    fs.writeSync(fd, 'app.get("/", function(req, res){\n');
                    fs.writeSync(fd, '  res.sendfile("/index.html");\n');
                    fs.writeSync(fd, '});\n');
                    fs.writeSync(fd, 'var port = process.env.PORT || 9000;\n');
                    fs.writeSync(fd, 'app.listen(port, function() {\n');
                    fs.writeSync(fd, '    console.log("Listening on port " + port);\n');
                    fs.writeSync(fd, '});');
                    done();
                }
            }, {
                //Add .gitignore to ensure node_modules folder doesn't get uploaded
                file: 'heroku/.gitignore',
                method: function(fs, fd, done) {
                    fs.writeSync(fd, 'node_modules');
                    done();
                }
            }]
        }
    },
    //Heroku Settings
    shell: {
        'heroku-create': {
            command: [
                'cd heroku',
                'heroku create ' + herokuAppName,
                'heroku config:set PORT=80 --app ' + herokuAppName
            ].join('&&')
        },
        'heroku-dyno': {
            command: [
                'cd heroku',
                'heroku ps:scale web=1 --app ' + herokuAppName
            ].join('&&')
        },
        'heroku-git-init': {
            command: [
                'cd heroku',
                'git init',
                'git remote add ' + herokuAppName + ' git@heroku.com:' + herokuAppName + '.git',
            ].join('&&')
        },
        'heroku-git-push': {
            command: [
                'cd heroku',
                'git add -A',
                'git commit -m "' + (grunt.option('gitm') ? grunt.option('gitm') : 'updated') + '"',
                'START /WAIT git push ' + herokuAppName + ' master',
                'heroku open --app ' + herokuAppName
            ].join('&&')
        }
    }, 

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/app/styles',
                connect.static('./app/styles')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*',
            //Heroku Settings
            '!<%= yeoman.dist %>/Procfile',
            '!<%= yeoman.dist %>/package.json',
            '!<%= yeoman.dist %>/server.js',
            '!<%= yeoman.dist %>/.gitignore'              
          ]
        }]
      },
      //Heroku Settings
      heroku: {
          files: [{
              dot: true,
              src: [
                  'heroku/*',
                  '!heroku/.git*',
                  '!heroku/.gitignore',
                  '!heroku/.server.js',
                  '!heroku/.Procfile'
              ]
          }]
      },       
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      server: {
        options: {
          map: true,
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        ignorePath:  /\.\.\//,
        fileTypes:{
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
              detect: {
                js: /'(.*\.js)'/gi
              },
              replace: {
                js: '\'{{filePath}}\','
              }
            }
          }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/images',
          '<%= yeoman.dist %>/styles'
        ]
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      //Heroku Settings
      heroku: {
          files: [{
              dest: 'heroku/bower.json',
              src: 'bower.json'
          }, {
              expand: true,
              dot: true,
              cwd: '<%= yeoman.app %>',
              dest: 'heroku',
              src: [
                  '**'
              ]
          }]
      },
      herokumin: {
          files: [{
              expand: true,
              dot: true,
              cwd: '<%= yeoman.dist %>',
              dest: 'heroku',
              src: [
                  '**'
              ]
          }]
      },       
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'autoprefixer:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'wiredep',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  //Heroku Settings
  grunt.registerTask('heroku', function(method) {
      if (typeof grunt.option('min') === 'undefined') {
          grunt.option('min', true);
      }
      if (grunt.option('min')) {
          grunt.option('cwd', 'dist');
      } else {
          grunt.option('cwd', 'app');
      }
      if(method === 'init') {
        grunt.task.run([
            'mkdir:heroku'
        ]);
      }
      grunt.task.run([
          'clean:heroku',
          'file-creator:heroku'
      ]);
      if (grunt.option('min')) {
          grunt.task.run([
              'copy:herokumin'
          ]);
      } else {
          grunt.task.run([
              'copy:heroku'
          ]);
      }
      switch (method) {
          case 'init':
              grunt.task.run([
                  'shell:heroku-create',
                  'shell:heroku-git-init',
                  'shell:heroku-git-push',
                  'shell:heroku-dyno',
              ]);
              break;
          case 'push':
              grunt.task.run([
                  'shell:heroku-git-push'
              ]);
              break;
          default:
              console.log('heroku:' + method + ' is not a valid target.');
              break;
      }
  });
};
