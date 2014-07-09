'use strict';

/**
 * @ngdoc function
 * @name ngWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngWebApp
 */
angular.module('ngWebApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
