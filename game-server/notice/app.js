var http = require('http');
var url = require('url');
var path = require('path');
var read = require('fs').readFileSync;
var ejs = require('ejs');
var htmlStr = require('html-strings');

var HOST = '127.0.0.1';
var PORT = '8001'

var notice_path = './static/notice.html'

function readFile(name) {
  return read(path.join(__dirname, name), 'utf8').replace(/\r/g, '');
}

http.createServer(function(req, res) {
	var pathname = url.parse(req.url).pathname;

	if (!pathname in routes){
		res.writeHead(404, 'Not Found');
		return res.end();
	}
	
	if (/^\/static\//.test(pathname)) {
		pathname = '/static';
	}

	return routes[pathname](req, res);
}).listen(PORT, HOST);

console.log('notice server runing on http:'+HOST+':'+PORT);

var index = function(req, res) {
	var html = ejs.render(readFile('index.html'), {
		text: 'notice content'
	});
	res.write(html);
	res.end();
};

var admin = function(req, res) {
	res.write(ejs.render(readFile('/static/admin.ejs'), {
		text: htmlStr.escape(readFile('/static/notice.ejs')),
		filename: path.join(__dirname, 'static', 'admin.ejs')
	}));
	res.end();
};

var saveNotice = function(req, res) {
	if (req.method != "POST") {
		res.writeHead(401, 'Forbidden')
		return res.end();
	}
	console.log(req);

	//fs.writeFileSync(notice_path, text);
	res.end();
};

var static = function(req, res) {
	var filename = url.parse(req.url).pathname;
	res.write(ejs.render(readFile(filename)));
	res.end();
};

var routes = {
	'/notice': index,
	'/admin': admin,
	'/notice/save': saveNotice,
	'/static': static
};