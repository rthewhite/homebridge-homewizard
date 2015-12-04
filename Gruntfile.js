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
      dev: {
        files: ['src/**/*.js'],
        tasks: ['babel:build']
      }
    }
  });


  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-release');

  grunt.registerTask('dev', [
    'clean',
    'babel:build',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean',
    'eslint',
    'babel:build'
  ]);
};
