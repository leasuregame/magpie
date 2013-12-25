var http = require('http');
var url = require('url');
var path = require('path');
var read = require('fs').readFileSync;
var write = require('fs').writeFileSync;
var ejs = require('ejs');
var qs = require('querystring');

var HOST = '127.0.0.1';
var PORT = '8001'

var notice_path = './static/notice.ejs'

function readFile(name) {
  return read(path.join(__dirname, name), 'utf8').replace(/\r/g, '');
}

http.createServer(function(req, res) {
	var pathname = url.parse(req.url).pathname;

	if (!pathname in routes || pathname == '/favicon.ico'){
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
		text: 'notice content',
		filename: path.join(__dirname, 'index.html')
	});
	res.write(html);
	res.end();
};

var admin = function(req, res) {
	res.write(ejs.render(readFile('/static/cleditor.ejs'), {
		text: readFile('/static/notice.ejs'),
		filename: path.join(__dirname, 'static', 'cleditor.ejs')
	}));
	res.end();
};

var saveNotice = function(req, res) {
	if (req.method != "POST") {
		res.writeHead(401, 'Forbidden')
		return res.end();
	}
	var body = '';
	req.on('data', function(data) {
		body += data;
		write(notice_path, qs.parse(body).content);
		res.end();
	});
	console.log(body);	
};

var static = function(req, res) {
	var filename = url.parse(req.url).pathname;
	res.write(ejs.render(readFile(filename)));
	res.end();
};

var routes = {
	'/': index,
	'/notice': index,
	'/admin': admin,
	'/notice/save': saveNotice,
	'/static': static
};