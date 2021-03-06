/*
 * @license MIT
 * @file
 * @copyright KeyW Corporation 2016
 */


'use strict';

angular.module('hog', [
    'ngTable',
    'ngRoute',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    'ngMessages',
    'ngMaterial',
    'ngMdIcons',
    'ui.router',
    'ui.ace',
    'btford.socket-io',
    'uuid4',
    'vAccordion',
    'ngLodash',
    'chart.js',
    'md.data.table',
    'pig.filters',
    'pig.pig-flow',
    'pig.uploader',
    'hog.hog-templates',
    'pig.output-table',
    'mdColors',
    'luegg.directives',
    'ngCsv',
    'diff-match-patch',
    'ngFileSaver',
    'angularMoment'
]).config(function($mdThemingProvider) {
  $mdThemingProvider
    .theme('default')
    .primaryPalette('blue')
    .accentPalette('orange');
})
  .config(function ( $urlRouterProvider , $locationProvider) {
    $urlRouterProvider
        .otherwise('/landing');
    $locationProvider.html5Mode(true);
  });
