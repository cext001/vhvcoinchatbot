'use strict';

const apiai = require('apiai');
const express = require('express');
const bodyParser = require('body-parser');

const SkypeBot = require('./skypebot');
const SkypeBotConfig = require('./skypebotconfig');

const REST_PORT = (process.env.PORT || 5000);

const botConfig = new SkypeBotConfig(
    "b37323d3c6dd43eeb037567483e10160",
    "en",
    "f6f66a29-f184-48a0-9913-bda96c22be4f",
    "bkVCGV20*%+foicfITP333@"
);

const skypeBot = new SkypeBot(botConfig);

// console timestamps
require('console-stamp')(console, 'yyyy.mm.dd HH:MM:ss.l');

const app = express();
app.use(bodyParser.json());

app.post('/chat', skypeBot.botService.listen());
app.get('/home', function(req, res) {
    res.send("home");
});

app.listen(REST_PORT, function () {
    console.log('Rest service ready on port ' + REST_PORT);
});