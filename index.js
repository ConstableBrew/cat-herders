var port = process.env.PORT || 3000;
var http = require('http');
var url  = require('url');

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static')('./dist');

var server = http.createServer(function(req, res) {
	console.info(req.url);

	var done = finalhandler(req, res);
	var urlParts = url.parse(req.url);

	switch (urlParts.path) {
		default:
			serveStatic(req, res, done);
	}
})
.listen(port);

console.info('listening on port', port);
