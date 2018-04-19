var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createServer();
server.use(restify.CORS());
server.use(restify.queryParser());
server.listen(process.env.port || process.env.PORT || 4000, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_SECRET
});

var bot = new builder.UniversalBot(connector);

server.post('/', connector.listen());

server.get('/', function (req, res) {
    if (req.query.hub.verify_token === _config.ms.messengerSecret) {
        res.write(req.query.hub.challenge);
        res.end();
    } else {
        res.send('Error, wrong validation token');
    }
});