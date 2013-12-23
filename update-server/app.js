var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var mime = require('mime');

var LAST_VERSION = '1.7.0';
var CURR_VERSION = '1.8.0';
var PORT = 3434;

var server = http.createServer(function(req, res) {
    var pathname = url.parse(req.url).pathname;

    var _ref = pathname.split('/');
    var method = _ref[1], version = _ref[2] || '';

    var filename = 'big.zip';
    if (method == 'update') {
        if (version != '' && !/^\d{1,2}.\d{1,2}.\d{1,2}/.test(version)) {
            res.writeHead(400, "Bad Version Number");
            return res.end();
        }
        if (version == LAST_VERSION) {
            filename = 'small.zip';
        }

        res.writeHead(302, {
            location: 'https://github.com/visionmedia/ejs/archive/master.zip'
        });
        res.end();

        // var filepath = path.join(__dirname, 'build', filename);
        // var mimetype = mime.lookup(filepath);
        // res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        // res.setHeader('Content-type', mimetype);

        // var file = fs.createReadStream(filepath);
        // res.writeHead(200, 'ok');
        // file.pipe(res);
    } else if (method == 'version' && version == '') {
        res.write(CURR_VERSION);
        res.end();
    } else {
        res.writeHead(404, "Not Found", {'Content-Type': 'text/plain'});
        res.end();
    }
}).listen(PORT);

console.log("Server running at port: http://127.0.0.1:" + PORT);

