'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */
var myapp = angular
  .module('sbAdminApp', [
    'oc.lazyLoad',
    'ngMessages',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'common.services',
    'ngSanitize',
    'ui.bootstrap-slider',
    'ui.grid.treeView',
    'mgcrea.ngStrap',
    'satellizer'
  ])
    .run(function ($rootScope, $state, $auth) {
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {

            // if (toState.authenticate && !$auth.isAuthenticated()) {
            //     // User isn’t authenticated
            //     $state.transitionTo("login");
            //     event.preventDefault();
            // }
        });
    })
    .constant("appSettings", {
        //serverPath: "http://10.15.171.35:8080",
        //authPath: "http://10.15.171.35:9000"
        serverPath: "http://localhost:3700",
        authPath: "http://localhost:9000"
    })
  .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$authProvider', 'appSettings', function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $authProvider, appSettings) {

      $ocLazyLoadProvider.config({
          debug: false,
          events: true,
      });

      $authProvider.facebook({
          clientId: '804896872898846'
      });

      $authProvider.google({
          clientId: '612423556891-59he3rnnqst0dgo8598ua1jg93tvp8ip.apps.googleusercontent.com'
      });

      $authProvider.loginUrl = appSettings.authPath + '/auth/login';
      $authProvider.signupUrl = appSettings.authPath + '/auth/signup'

      $urlRouterProvider.otherwise('/models');

      $stateProvider
          .state('modelList', {
              templateUrl: 'app/views/model/modelList.html',
              url: '/models',
              controller: "ModelListCtrl",
              authenticate: true
          })
          .state('modelEdit', {
              templateUrl: 'app/views/model/modelEdit.html',
              url: '/models/edit/:modelId',
              controller: "ModelEditCtrl",
              authenticate: true
          })
      //End
  }])
