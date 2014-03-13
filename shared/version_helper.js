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
  if (!obj_key) {
    canonicalized_resource = '/'+bucket;
  }

  return util.format("%s\n%s\n%s\n%d\n%s%s", method, content_md5,
    content_type, expire, canonicalized_kss_headers, canonicalized_resource);
};

var make_request_url = function(method, bucket, obj_key, server) {
  if (!server) {
    server = HOST;
  }

  var expires = new Date().getTime() + 60000;
  var attach_url = '&response-content-type=application%2Foctet-stream&response-content-disposition=attachment%3Bfilename%3Dlatest.zip';
  var file_name = '';
  var request_url = util.format("%s/%s/%s?AccessKeyId=%s&Expires=%s&Signature=%s",
    server, bucket, obj_key, AccessKeyID, expires,
    encodeURIComponent(hmac_sha1(AccessKeySecret, string_to_sign(method, bucket, obj_key, expires))));
  return request_url;
};

var make_bucket_get_url = function(method, bucket, filter, server) {
  if (!server) {
    server = HOST;
  }

  var expires = new Date().getTime() + 60000;
  var request_url = util.format("%s/%s?AccessKeyId=%s&Expires=%s&Signature=%s&prefix=%s",
    server, bucket, AccessKeyID, expires,
    encodeURIComponent(hmac_sha1(AccessKeySecret, string_to_sign(method, bucket, null, expires))), filter);
  return request_url;
};

var versionPath = function() {
  return path.join(__dirname, 'version.json');
};

var versionData = function() {
  var fpath = versionPath();
  if (!fs.existsSync(fpath)) {
    return {
      app: {
        version: '1.0.0',
        lastVersion: '1.0.0',
        oldestVersion: '1.0.0',
        filename: '',
        lastFilename: ''
      },
      tb: {
        version: '1.0.0',
        lastVersion: '1.0.0',
        oldestVersion: '1.0.0',
        filename: '',
        lastFilename: ''
      }
    }
  }
  return JSON.parse(fs.readFileSync(fpath, 'utf8'));
};

var getVersion = function(platform, cb) {
  var vdata = versionData();
  if (typeof vdata[platform] == 'undefined') {
    return cb('Can not find version by '+platform);
  } else {
    return cb(null, vdata[platform].version);
  }
};

var getLastVersion = function(platform) {
  var vData = versionData();
  return vData[platform].lastVersion;
};
var updateVersions = function(data) {
  jdata = versionData();

  var fields = ['version', 'lastVersion', 'filename', 'lastFilename', 'oldestVersion'];

  var platform;
  for (platform in jdata) {
    for (var i = 0; i < fields.length; i++) {
      var field = fields[i];
      var vfield = platform+'_'+field;
      if (vfield in data) {
        jdata[platform][field] = data[vfield];
      }
    }
  }

  fs.writeFileSync(versionPath(), JSON.stringify(jdata));
};

var versionCompare = function( stra, strb ) {
  var straArr = stra.split('.');
  var strbArr = strb.split('.');
  var maxLen = Math.max( straArr.length, strbArr.length );
  var result, sa, sb;
  for ( var i = 0; i < maxLen; i++ ) {
    sa = ~~straArr[i];
    sb = ~~strbArr[i];
    if(sa > sb){
      result = 1;
    }
    else if(sa < sb){
      result = -1;
    }
    else {
      result = 0;
    }
    if ( result !== 0 ) {
      return result;
    }
  }
  return result;
};

module.exports = {
  make_request_url: make_request_url,
  make_bucket_get_url: make_bucket_get_url,
  versionData: versionData,
  version: getVersion,
  lastVersion: getLastVersion,
  updateVersions: updateVersions,
  versionCompare: versionCompare
};