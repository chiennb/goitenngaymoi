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

             if (toState.authenticate && !$auth.isAuthenticated()) {
                 // User isn’t authenticated
                 $state.transitionTo("login");
                 event.preventDefault();
             }
        });
    })
    .constant("appSettings", {
        serverPath: "http://10.15.171.35:6969",
        authPath: "http://10.15.171.35:9000"
        //serverPath: "http://localhost:6969",
        //authPath: "http://localhost:9000"
    })
  .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$authProvider', 'appSettings', function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $authProvider, appSettings) {

      $ocLazyLoadProvider.config({
          debug: false,
          events: true,
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
          .state('login', {
              //templateUrl: 'views/pages/login.html',
              templateUrl: 'app/views/shares/login/login.html',
              url: '/login',
              controller: 'LoginCtrl',
              authenticate: false
          })
          .state('logout', {
              url: '/logout',
              template: null,
              controller: 'LogoutCtrl',
              authenticate: false
          })
        .state('signup', {
            //templateUrl: 'views/pages/login.html',
            templateUrl: 'app/views/shares/signup/signup.html',
            url: '/signup',
            controller: 'SignupCtrl',
            authenticate: false
        })
      //End
  }])
  .controller('MainCtrl', ['$scope', '$auth', function ($scope, $auth) {

      $scope.isAuthenticated = function () {
          return $auth.isAuthenticated();
      };
  }]);