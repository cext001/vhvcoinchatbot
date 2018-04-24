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
        console.log("Action: " + req.body.result.action + ", Intent: " + req.body.result.metadata.intentName);
        switch (req.body.result.action) {
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
                            speech: "Sorry to hear about the accident! ;-( Was anyone injured in the accident?",
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
                            speech: "Good to know that! :-) Has the vehicle been damaged in the accident?",
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
                            title: "Please select",
                            type: 1,
                            imageUrl: "http://kenrobertsautoglass.com/wp-content/uploads/2013/11/Replacement-Aftermarket-Car-Body-Parts.jpg",
                            buttons: [
                                {
                                    postback: "Windshield",
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
                                    postback: "close it",
                                    text: "close it"
                                }
                            ]

                        }
                    ]
                }).end();
                break;
            case "claim.getdamagedparts":
                /*var response = {};
                var verchiclepartsincontext = req.body.result.contexts[0].parameters.partsofvehicle;
                var verchiclepartslist = (req.body.result.contexts[0].parameters.partsofvehiclelist) ? req.body.result.contexts[0].parameters.partsofvehiclelist : "";
                console.log("inside claim.getdamagedparts");
                console.log(req.body.result.contexts[0]);


                var messsage = verchiclepartsincontext + " has been added.";
                var vehicleparts = verchiclepartslist.split(',');
                console.log("Array length:" + vehicleparts.length);
                if (vehicleparts.length == 1) {
                    if (vehicleparts[0] == verchiclepartsincontext) {
                        verchiclepartslist = verchiclepartslist;
                    } else if (vehicleparts[0] == "") {
                        verchiclepartslist = verchiclepartsincontext;
                    } else {
                        verchiclepartslist = verchiclepartslist + ", " + verchiclepartsincontext;
                    }
                } else {
                    if (!(vehicleparts.indexOf(verchiclepartsincontext) > -1)) {
                        verchiclepartslist + "," + verchiclepartsincontext
                    } else {
                        messsage = verchiclepartsincontext + " is already added.";
                    }
                }

                response = {
                    messages: [
                        {
                            platform: "skype",
                            speech: messsage,
                            type: 0
                        }
                    ],
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
                res.json(response).end();*/
                console.log("insider damaged parts");
                break;
            case "claimgetdamagedparts.claimgetdamagedparts-getthirdpartydamagedparts":
                console.log("Hi in followup");
                break;
        }

    }
})

app.listen(REST_PORT, function () {
    console.log('Rest service ready on port ' + REST_PORT);
});