'use strict';

/**
 * @ngdoc function
 * @name ngWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngWebApp
 */
angular.module('ngWebApp')
  .controller('MainCtrl', function ($scope, $http) {
    var queryDate = '', areaId = 1;

    $http.get('/admin/stats/onlineuser?date='+queryDate+'&areaId='+areaId)
    .success(function(data) {
      $scope.userData = data;
    });

  });
