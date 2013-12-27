/*
 * GET home page.
 */

var fs = require('fs');
var path = require('path');

exports.index = function(req, res) {
  res.render('index', {
    title: 'LeasureGame'
  });
};