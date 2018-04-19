const fs = require('fs');
var restify = require('restify');

var handler = function (request, res) {
    if (request.method === 'POST') {
        var body = '';
        request.on('data', function (data) {
            body += data;
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) {
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                request.connection.destroy();
            }
        });
        request.on('end', function () {

            console.log(body)
            // use POST

        });
    }

    res.writeHead(200, {'Content-Type': 'application/json'});
    //res.end(parseCommands(req));
    res.end(`{
    "type": "message",
    "text": "This is a reply!"
    }`);
};

// Setup Restify Server
var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 8080, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Listen for messages from users
server.post('/chat', handler);