'use strict';

angular.module('myApp.welcomeView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/welcomeView', {
    templateUrl: 'welcomeView/welcomeView.html',
    controller: 'welcomeViewCtrl'
  });
}])

.controller('welcomeViewCtrl', [function() { // nothing much to be done when showing splash
}]);