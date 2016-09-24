module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
      },
      lib: {
        // the files to concatenate
        src: ['public/lib/jquery.js',
              'public/lib/underscore.js',
              'public/lib/backbone.js',
              'public/lib/handlebars.js'
              ],
        // the location of the resulting JS file
        dest: 'public/dist/lib.js'
      },
      client: {
        src : 'public/client/*.js',
        dest: 'public/dist/client.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      options: {
        // the banner is inserted at the top of the output
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      client: {
        files: {
          'public/dist/client.min.js': ['<%= concat.client.dest %>']
        }
      },
      lib: {
        files: {
          'public/dist/lib.min.js': ['<%= concat.lib.dest %>']
        }
      }
    },

    eslint: {
      target: [
        // Add list of files to lint here
        'public/client/*.js',
        'public/lib/*.js'
      ]
    },

    cssmin: {
      target: {
        files: [{
              expand: true,
              cwd: 'public',
              src: ['*.css', '!*.min.css'],
              dest: 'public/dist',
              ext: '.min.css'
            }]
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command :
          'git push shortly master',
        options : {
          callback : function(err, stdout, stderr) {
            if(err) console.log(err);
            else console.log(stdout);
          }
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });


  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      // add your production server task here

    }
    grunt.task.run([ 'server-dev' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);


  grunt.registerTask('build', [
    'concat','uglify','cssmin'
  ]);

  grunt.registerTask('deploy', function(n) {
    if(grunt.option('prod')) {
      grunt.task.run(['shell'])
    }
    else {
      grunt.task.run([
        'build','nodemon','watch'
      ])
    }
  });


};
