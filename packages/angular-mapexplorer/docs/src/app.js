import Home from './Home.controller';
import 'angular';
import 'angular-aria';
import 'angular-animate';
import 'angular-material';
import 'angular-ui-ace';
import 'angular-route';
import 'md-color-picker';
import 'angular-sanitize';
import '../libs/angular-drop';
import mapExplorer from '../../src/index';

angular.module('angularMapexplorerDemo', [
  'ngSanitize', 'ngRoute', 'ngAnimate', 'ngMaterial', mapExplorer, 'ui.ace'
])
  .config(['$routeProvider', '$locationProvider',
    ($routeProvider, $locationProvider) => {
      // can't use this with github pages / if don't have access to the server
      $locationProvider.html5Mode(false);

      $routeProvider.when('/home', { templateUrl: 'home.html' });

      $routeProvider.otherwise({ redirectTo: '/home' });
    }])
  .controller('Home', Home);
