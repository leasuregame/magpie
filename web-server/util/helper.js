var util = require('util');
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');

var AccessKeyID = 'HFEJ65F3REIOD6J7XRIQ';
var AccessKeySecret = 'j0Bxgs2O1DNq5Pn9I1JifRub0RChbAq8iRsp6gTo';
var HOST = 'http://kss.ksyun.com';
var GET = 'GET';


var hmac_sha1 = function(obj_key, sign_str) {
  return crypto.createHmac('sha1', new Buffer(obj_key, 'utf8'))
    .update(new Buffer(sign_str, 'utf8'))
    .digest()
    .toString('base64');
};

var string_to_sign = function(method, bucket, obj_key, expire) {
  var content_md5 = '';
  var content_type = '';
  var canonicalized_kss_headers = '';
  var canonicalized_resource = util.format('/%s/%s', bucket, obj_key);

  return util.format("%s\n%s\n%s\n%d\n%s%s", method, content_md5,
    content_type, expire, canonicalized_kss_headers, canonicalized_resource);
};

var make_request_url = function(method, bucket, obj_key, server) {
  var expires = new Date().getTime() + 60000;
  var attach_url = '&response-content-type=application%2Foctet-stream&response-content-disposition=attachment%3Bfilename%3Dlatest.zip';
  var file_name = '';
  var request_url = util.format("%s/%s/%s?AccessKeyId=%s&Expires=%s&Signature=%s",
    server, bucket, obj_key, AccessKeyID, expires,
    encodeURIComponent(hmac_sha1(AccessKeySecret, string_to_sign(method, bucket, obj_key, expires))));
  return request_url;
};

var versionPath = function(){
  return path.join(__dirname, 'version.json');
}

var versionData = function() {
  return JSON.parse(fs.readFileSync(versionPath(), 'utf8'));
};

var getVersion = function() {
  return rversionData().version;
};

var getLastVersion = function(){
  return versionData().lastVersion;
};
var updateVersions = function(data) {
  jdata = JSON.parse(fs.readFileSync(versionPath(), 'utf8'));
  if (data.curversion) {
    jdata.version = data.curversion;
  }
  if (data.lastversion) {
    jdata.lastVersion = data.lastversion;
  }
  fs.writeFileSync(versionPath(), JSON.stringify(jdata));
};

module.exports = {
  make_request_url: make_request_url,
  versionData: versionData,
  version: getVersion,
  lastVersion: getLastVersion,
  updateVersions: updateVersions
};