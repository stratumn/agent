var webpack = require('./webpack.config');

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
      'bower_components/tinycolor/tinycolor.js',
      'bower_components/md-color-picker/dist/mdColorPicker.js',
      'bower_components/angular-drop/angular-drop.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'test/*.spec.js',
      'test/fixtures/*.json'
    ],


    // list of files to exclude
    exclude: [

    ],

    preprocessors: {
      'src/index.js': ['webpack', 'sourcemap'],
      'test/*.spec.js': ['webpack', 'sourcemap']
    },

    webpack: webpack,

    webpackMiddleware: {
      stats: {
        chunks: false,
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


  if(process.env.TRAVIS){
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
