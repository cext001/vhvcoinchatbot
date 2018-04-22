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
                            speech: "Sure, thank you.",
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
            case "claim.getclaimtype":
                console.log("inside: claim.getclaimtype");
                res.json({
                    messages: [
                        {
                            platform: "skype",
                            speech: "Now please help me out with the cause of damage?",
                            type: 0
                        },
                        {
                            platform: "skype",
                            subtitle: "",
                            title: "Please select",
                            type: 1,
                            buttons: [
                                {
                                    postback: "Fire",
                                    text: "Fire"
                                },
                                {
                                    postback: "Collision with pedestrian",
                                    text: "Collision with pedestrian"
                                },
                                {
                                    postback: "Collision with another vehicle",
                                    text: "Collision with another vehicle"
                                },
                                {
                                    postback: "Collision with animal",
                                    text: "Collision with animal"
                                },
                                {
                                    postback: "Collision with Train or Bus",
                                    text: "Collision with Train or Bus"
                                }
                            ]

                        }
                    ]
                }).end();
                break;
            case "claim.getcauseofdamage":
                console.log("inside: claim.getcauseofdamage-no-custom-yes");
                res.json({
                    messages: [
                        {
                            platform: "skype",
                            speech: "Sorry to hear about the accident!;-( Was anyone injured in the accident?",
                            type: 0
                        },
                        {
                            platform: "skype",
                            subtitle: "",
                            title: "Please select",
                            type: 1,
                            buttons: [
                                {
                                    postback: "Yes",
                                    text: "Yes"
                                },
                                {
                                    postback: "No",
                                    text: "No"
                                }
                            ]
                        }
                    ]
                }).end();
                break
            case "claimgetcauseofdamage.claimgetcauseofdamage-no":
                console.log("inside: claimgetcauseofdamage.claimgetcauseofdamage-no");
                res.json({
                    messages: [
                        {
                            platform: "skype",
                            speech: "Good to know that!:-) Has the vehicle been damaged in the accident?",
                            type: 0
                        },
                        {
                            platform: "skype",
                            subtitle: "",
                            title: "Please select",
                            type: 1,
                            buttons: [
                                {
                                    postback: "Yes",
                                    text: "Yes"
                                },
                                {
                                    postback: "No",
                                    text: "No"
                                }
                            ]

                        }
                    ]
                }).end();
                break;
            case "claimgetcauseofdamage.claimgetcauseofdamage-no.claimgetcauseofdamage-no-yes":
                console.log("inside: claimgetcauseofdamage.claimgetcauseofdamage-no.claimgetcauseofdamage-no-yes");
                res.json({
                    messages: [
                        {
                            platform: "skype",
                            speech: "I have made a note, Now can you please indicate which all parts of the vehicle were damaged in the accident?",
                            type: 0
                        },
                        {
                            platform: "skype",
                            subtitle: "",
                            title: "Please select and click finish",
                            type: 1,
                            buttons: [
                                {
                                    postback: "Fire",
                                    text: "Windshield"
                                },
                                {
                                    postback: "Bumper",
                                    text: "Bumper"
                                },
                                {
                                    postback: "Front Side",
                                    text: "Front Side"
                                },
                                {
                                    postback: "Rear",
                                    text: "Rear"
                                },
                                {
                                    postback: "Hood",
                                    text: "Hood"
                                },
                                {
                                    postback: "Finish",
                                    text: "Finish"
                                }
                            ]

                        }
                    ]
                }).end();
                break;
            case "claim.getdamegedparts":
                var response = {};
                var verchiclepartslist = (req.body.result.contexts[0].parameters.partsofvehiclelist) ? req.body.result.contexts[0].parameters.partsofvehiclelist : "";
                console.log("verchiclepartslist " + verchiclepartslist);
                console.log("inside claim.getdamegedparts");
                if (req.body.result.resolvedQuery == "Finish") {
                } else {
                    var verchiclepartsincontext = req.body.result.contexts[0].parameters.partsofvehicle;
                    var vehicleparts = verchiclepartslist.split(',');
                    console.log(vehicleparts.length);
                    if (vehicleparts.length == 1) {
                        verchiclepartslist = (verchiclepartslist !== "") ? verchiclepartsincontext + "," + verchiclepartslist : verchiclepartsincontext;
                    } else {
                        verchiclepartslist = ((vehicleparts.indexOf(verchiclepartsincontext) > -1)) ? verchiclepartslist : verchiclepartslist + "," + verchiclepartsincontext;
                    }
                    response = {
                        contextOut: [
                            {
                                name: "vehicle-damagedpart",
                                parameters: {
                                    partsofvehiclelist: verchiclepartslist
                                },
                                lifespan: 5
                            }
                        ]
                    };

                    console.log(JSON.stringify(response));

                    res.json(response).end();
                }
                break;
        }
    }
})

app.listen(REST_PORT, function () {
    console.log('Rest service ready on port ' + REST_PORT);
});