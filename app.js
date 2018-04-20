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
        switch (req.body.result.action) {
            case "claimraiseissue.claimraiseissue-custom":
                console.log("inside: claimraiseissue.claimraiseissue-custom");
                if (req.body.result.resolvedQuery == "Yes Please") {
                    console.log("inside: claimraiseissue.claimraiseissue-custom user selected yes");
                    res.json({
                        speech: "Please can you tell me your policy number",
                        displayText: "Please can you tell me your policy number",
                        type: 0
                    }).end();
                }
                break;
            case "claim.getdateandtime":
                console.log("inside: claim.getdateandtime");
                res.json({
                    messages: [
                        {
                            platform: "skype",
                            speech: "Sure, thank you. Can you please help me with the type of claim that you want to initiate?",
                            type: 0
                        },
                        {
                            platform: "skype",
                            speech: "Can you please help me with the type of claim that you want to initiate?",
                            type: 0
                        },
                        {
                            platform: "skype",
                            subtitle: "",
                            title: "Please select",
                            type: 1,
                            buttons: [
                                {
                                    postback: "Auto Claim",
                                    text: "Auto Claim"
                                },
                                {
                                    postback: "Glass Claim",
                                    text: "Glass Claim"
                                },
                                {
                                    postback: "Incident Only",
                                    text: "Incident Only"
                                }
                            ]

                        }
                    ]
                }).end();
                break;
        }
    }
})

app.listen(REST_PORT, function () {
    console.log('Rest service ready on port ' + REST_PORT);
});