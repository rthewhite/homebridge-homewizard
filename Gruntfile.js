/*global module:false*/
module.exports = function(grunt) {

  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: './dist/*'
    },

    eslint: {
      options: {
        configFile: '.eslintrc'
      },
      local: {
        src: [
          'src/**/*.js'
        ]
      }
    },

    babel: {
      // Not using babelrc here. We dont want rewire in the build
      // mochaTest is only able to use the babelrc....
      options: {
        babelrc: false,
        presets: ['es2015'],
        plugins: [
          'transform-class-properties',
          'transform-export-extensions',
          'add-module-exports'
        ]
      },
      build: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: '**/*.js',
          dest: 'dist/'
        }]
      }
    },
    watch: {
      src: {
        files: ['src/**/*.js'],
        tasks: ['babel:build', 'mochaTest']
      },
      tests: {
        files: ['test/**/*.js'],
        tasks: ['mochaTest']
      }
    },
    release: {
      options: {
        beforeBump: ['build']
      }
    },
    coveralls: {
      src: 'coverage/lcov.info'
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: 'babel-register'
        },
        src: [
          'test/**/*.spec.js'
        ]
      }
    }
  });


  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-release');
  grunt.loadNpmTasks('grunt-coveralls');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('dev', [
    'clean',
    'babel:build',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean',
    'eslint',
    'babel:build',
    'mochaTest'
  ]);
};
