// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function configure(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-remap-istanbul'),
      require('@angular/cli/plugins/karma')
    ],
    files: [{ pattern: './docs_src/test.ts', watched: false }],
    preprocessors: {
      './docs_src/test.ts': ['@angular/cli']
    },
    remapIstanbulReporter: {
      reports: {
        html: 'coverage',
        lcovonly: './coverage/coverage.lcov'
      }
    },
    angularCli: {
      config: './angular-cli.json',
      environment: 'dev'
    },
    reporters: ['progress', 'karma-remap-istanbul'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });

  if (process.env.TRAVIS || process.env.SEMAPHORE) {
    config.set({
      browsers: ['CI_Chrome'],
      customLaunchers: {
        CI_Chrome: {
          base: 'ChromeHeadless',
          flags: ['--no-sandbox']
        }
      },
      singleRun: true
    });
  }
};
