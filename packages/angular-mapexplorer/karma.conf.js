var babel = require('rollup-plugin-babel');
var babelrc = require('babelrc-rollup').default;
var json = require('rollup-plugin-json');

module.exports = function(config) {
  'use strict';
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'bower_components/babel-polyfill/browser-polyfill.js',
      'bower_components/angular/angular.min.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-aria/angular-aria.js',
      'bower_components/angular-material/angular-material.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/ace-builds/src/ace.js',
      'bower_components/angular-ui-ace/ui-ace.js',
      'bower_components/tinycolor/tinycolor.js',
      'bower_components/md-color-picker/dist/mdColorPicker.js',
      'bower_components/angular-drop/angular-drop.js',
      'bower_components/d3/d3.js',
      'bower_components/mapexplorer-core/dist/mapexplorer-core.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'dist/angular-mapexplorer.js',
      'test/*.spec.js'
    ],


    // list of files to exclude
    exclude: [

    ],

    preprocessors: {
      'test/*.spec.js': ['rollup'],
      'dist/angular-mapexplorer.js': ['sourcemap']
    },

    rollupPreprocessor: {
      plugins: [
        json(),
        babel(Object.assign({
          exclude: 'node_modules/**'
        }, babelrc()))
      ],
      // will help to prevent conflicts between different tests entries
      format: 'iife',
      sourceMap: 'inline',
      globals: {
        "angular-mapexplorer": "angularMapexplorer"
      }
    },


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['dots'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['Chrome', 'PhantomJS'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });


  if (process.env.TRAVIS){
    config.set({
      browsers: ['TravisCI_Chrome', 'PhantomJS'],
      customLaunchers: {
        TravisCI_Chrome: {
          base: 'Chrome',
          flags: ['--no-sandbox']
        }
      }
    });
  }
};
