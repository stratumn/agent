const istanbul = require('rollup-plugin-istanbul');
const plugins = require('./rollup.browser.plugins');

module.exports = function configure(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    plugins: ['@metahub/karma-rollup-preprocessor', 'karma-*'],

    // frameworks to use
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-animate/angular-animate.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-material/angular-material.js',
      'node_modules/angular-sanitize/angular-sanitize.js',
      'node_modules/angular-aria/angular-aria.js',
      'node_modules/tinycolor2/dist/tinycolor-min.js',
      'node_modules/md-color-picker/dist/mdColorPicker.js',
      'node_modules/babel-polyfill/dist/polyfill.js',
      'test/*.spec.js'
    ],

    // list of files to exclude
    exclude: [],

    preprocessors: {
      'test/*.spec.js': ['rollup'],
      'dist/angular-mapexplorer.js': ['sourcemap']
    },

    rollupPreprocessor: {
      options: {
        plugins: [
          istanbul({
            include: ['src/**'],
            // we have to exclude the directives because of an incompatibility with the angular plugin...
            exclude: ['src/*.directive.js']
          })
        ].concat(plugins),
        output: {
          // will help to prevent conflicts between different tests entries
          format: 'iife',
          sourcemap: 'inline'
        }
      }
    },

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'coverage'],

    coverageReporter: {
      reporters: [{ type: 'lcov' }]
    },

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

  if (process.env.TRAVIS) {
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
