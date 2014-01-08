var shortid = require('shortid');

exports.manage = function(req, res) {
  res.render('cdkey');
};

exports.pregenerate = function(req, res) {
  console.log(req.body);
  res.send(shortid.generate());
};

exports.generate = function(req, res) {
  console.log(req.body);
  res.send(shortid.generate());
};