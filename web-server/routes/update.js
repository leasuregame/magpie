var helper = require('../util/helper');
var KSS_HOST = 'http://kss.ksyun.com';

exports.version = function(req, res) {
  var ver = helper.version();
  res.send(ver);
};

exports.update = function(req, res) {
  var ver = req.params.version;
  var filename = 'big.zip';

  if (ver != null && ver != '' && !/^\d{1,2}.\d{1,2}.\d{1,2}/.test(ver)) {
    return res.status(400).send('Bad version number');
  }

  if (ver == helper.lastVersion()) {
    filename = 'small.zip';
  }

  res.redirect(helper.make_request_url('GET', 'magpie', filename, KSS_HOST));
};

exports.manage = function(req, res) {
  res.render('manage', {version: helper.versionData()});
};

exports.updateVersion = function(req, res) {
  console.log(req.body);
  helper.updateVersions(req.body);
  res.redirect('manage');
};