'use strict';

/**
 * @ngdoc function
 * @name ngWebApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ngWebApp
 */
angular.module('ngWebApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
