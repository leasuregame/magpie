//http://kss.ksyun.com/mybucket/hello.txt?AccessKeyId=KSSP3UPCMORAFON76Q6RTNQ&Expires=1141889120&Signature=vjbyPxybdZaNmGa%2ByT272YEAiv4%3D

var crypto = require('crypto');


var hmac_sha1 = function(obj_key, sign_str) {
	return crypto.createHmac('sha1', obj_key).update(sign_str).digest('hex');
};

var string_to_sign = function(method, bucket, obj_key) {
	var content_md5 = '';
	var content_type = '';
	var canonicalized_kss_headers = '';

	var date = new Date().toGMTString();
	var canonicalized_resource = util.format('/%s/%s', bucket, obj_key);

	return util.format("%s\n%s\n%s\n%s\n%s%s", method, content_md5, 
		content_type, date, canonicalized_kss_headers, canonicalized_resource);
};

var make_request = function(method, bucket, obj_key, server) {
	var request_url = util.format("%s/%s/%s?AccessKeyId=%s&Expires=%s&Signature=%s", 
		server, bucket, obj_key, string_to_sign(method, bucket, obj_key))	
};

//吴静	 广西壮族自治区 崇左市 扶绥县	双拥路东109号桂林理工大学空港校区	532100	15578061863

//吴静	 广西壮族自治区 南宁市 西乡塘区	南宁市心圩江东路八号盛天尚都7栋A座601	530003	0771-3292563
15578061863