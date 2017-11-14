const plugins = require('./rollupPlugins');
const istanbul = require('rollup-plugin-istanbul');

module.exports = function configure(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    plugins: ['@metahub/karma-rollup-preprocessor', 'karma-*'],

    frameworks: ['mocha', 'should'],

    // list of files / patterns to load in the browser
    files: [
      'test/integration/init.js',
      'test/integration/*.test.js',
      'node_modules/babel-polyfill/dist/polyfill.js'
    ],

    preprocessors: {
      'test/integration/init.js': ['rollup'],
      'test/integration/*.test.js': ['rollup']
    },

    rollupPreprocessor: {
      options: {
        plugins: [
          istanbul({
            include: ['src/**/*.js']
          })
        ].concat(plugins),
        // will help to prevent conflicts between different tests entries
        format: 'iife',
        output: {
          format: 'iife',
          sourcemap: 'inline'
        }
      }
    },

    // list of files to exclude
    exclude: [],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'coverage'],

    coverageReporter: {
      reporters: [
        {
          type: 'lcov'
        }
      ]
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
