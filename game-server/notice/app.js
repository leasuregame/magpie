var http = require('http');
var url = require('url');
var path = require('path');
var read = require('fs').readFileSync;
var ejs = require('ejs');

var HOST = '127.0.0.1';
var PORT = '6000'

function readFile(name) {
  return read(path.join(__dirname, name), 'utf8').replace(/\r/g, '');
}

http.createServer(function(req, res) {
	var pathname = url.parse(req.url).pathname;
	console.log(pathname, pathname != '/notice', pathname != '/notice/');
	if (req.method != 'GET') {
		res.writeHead(401, 'Forbidden')
		return res.end();
	}

	if (pathname != '/notice' && pathname != '/notice/'){
		res.writeHead(404, 'Not Found');
		return res.end();
	}

	var html = ejs.render(readFile('index.html'), {text: 'notice content'});
	res.write(html);
	res.end();
}).listen(8001);

console.log('notice server runing on http:'+HOST+':'+PORT);