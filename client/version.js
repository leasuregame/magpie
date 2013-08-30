var http = require("http");

http.createServer(function(request, response) {
	response.writeHead(200, {
		"Content-Type": "text/plain"
	});

	// var t = new Date().getTime();
	// response.write(t.toString());

	response.write("1.0.0");
	
	response.end();
}).listen(8888);