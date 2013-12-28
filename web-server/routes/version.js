var helper = require('../util/helper');
var KSS_HOST = 'http://kss.ksyun.com';

exports.version = function(req, res) {
  var platform = req.params.platform;
  helper.version(platform, function(err, ver) {
    if (err != null) {
      res.status(404).send(err);
    } else {
      res.send(ver);
    }
  });
};

exports.update = function(req, res) {
  var ver = req.params.version;
  var platform = req.params.platform;
  var vData = helper.versionData();
  if (!platform in vData) {
    return res.status(404).send('Not update for ' + platform);
  }

  var filename = vData[platform].filename;
  if (ver != null && ver != '' && !/^\d{1,2}.\d{1,2}.\d{1,2}$/.test(ver)) {
    return res.status(400).send('Bad version number');
  }

  if (ver == helper.lastVersion()) {
    filename = vData[platform].lastFilename;
  }

  res.redirect(helper.make_request_url('GET', 'magpie', filename, KSS_HOST));
};

exports.manage = function(req, res) {
  res.render('manage', {
    menu: 'version',
    version: helper.versionData()
  });
};

exports.updateVersion = function(req, res) {
  helper.updateVersions(req.body);
  res.redirect('/admin/version');
};