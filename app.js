'use strict';

const express = require('express')
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

const REST_PORT = process.env.PORT || 8080;

app.post('/api/messages', (req, res) => {
    console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
    if (req.body.result) {
        if (req.body.result.action == "claimraiseissue.claimraiseissue-custom") {
            console.log("inside: claimraiseissue.claimraiseissue-custom");
            if(req.body.result.resolvedQuery == "Yes Please") {
                res.json({
                    speech: "Please can you tell me your policy number",
                    displayText: "Please can you tell me your policy number",
                    source: ''
                }).end();
            }
        }
    }
})

app.listen(REST_PORT, function () {
    console.log('Rest service ready on port ' + REST_PORT);
});