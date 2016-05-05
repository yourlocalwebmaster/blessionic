// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('bless', ['ionic','ionic.service.core','restangular', 'bless.controllers','bless.directives','bless.services','ngStorage','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('gateway',{
    url: '/gateway',
    //templateUrl: 'templates/splashlogin.html',
    controller: function($scope,$state, $localStorage){
      if($localStorage.token){
        $state.go('app.home');
      }
      else{
        $state.go('splashlogin')
      }
    }
  })
  .state('splashlogin', {
    url: '/splashlogin',
    templateUrl: 'templates/splashlogin.html',
    controller: 'LoginSplashCtrl'
  })

      .state('app.home', {
        url: '/home',
        views:{
          'menuContent':{
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl'
          }
        }
      })
          .state('createaccount', {
        url: '/createaccount',
        templateUrl: 'templates/createaccount.html',
        controller: 'CreateAccountCtrl'
        
      })
      .state('app.terms',{
        url: '/terms',
        views:{
          'menuContent':{
            templateUrl: 'templates/terms.html'
          }
        }
      })
      .state('app.privacy',{
    url: '/privacy',
    views:{
      'menuContent':{
        templateUrl: 'templates/privacy.html'
      }
    }
  })
      .state('app.outreach',{
        url: '/outreach/{id:int}',
        views:{
          'menuContent':{
            templateUrl: 'templates/outreach.html',
            controller: 'OutreachCtrl'
          }
        }
      });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/gateway');
});
