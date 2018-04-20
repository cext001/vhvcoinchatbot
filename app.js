'use strict';

const express = require('express')
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

const REST_PORT = process.env.PORT || 8080;

app.post('/api/messages', (req, res) => {
    console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
    if (req.body.queryResult) {
        console.log("Action: " + req.body.queryResult.action);
        if (req.body.queryResult.action === "claim.raiseissue") {
            console.log("inside: claim.raiseissue");
            res.json({
                "source": "Webhook",
                "messages": [
                    {
                        "platform": "skype",
                        "speech": "Text response",
                        "type": 0
                    }
                ]
            }).end();
        }
    }
})

app.listen(REST_PORT, function () {
    console.log('Rest service ready on port ' + REST_PORT);
});