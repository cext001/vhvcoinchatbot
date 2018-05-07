'use strict';
const express = require('express')
const bodyParser = require('body-parser');
const helper = require('./helper');
const controller = require('./controller');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

const REST_PORT = process.env.PORT || 3000;

app.use(express.static('public'))

app.post('/api/messages', (req, res) => {
    console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
    var baseUrl = getBaseUrl(req);
    if (req.body.result) {
        console.log("Action: " + req.body.result.action + ", Intent: " + req.body.result.metadata.intentName);
        switch (req.body.result.action) {
            case "claim.getpolicytypes":
                console.log("inside: claim.getpolicytypes");
                console.log('context', req.body.result.contexts[0]);
                var lossTypes = {};
                return helper.getLossType().then((result) => {
                    lossTypes = result;
                    response = {
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
                                imageUrl: baseUrl + "images/car-crash.jpg",
                                buttons: lossTypes
                            }
                        ]
                    };
                    console.log('final response succ', response);
                    res.json(response).end();
                }).catch((err) => {
                    console.log('error getting loss types', err);
                    response = {
                        messages: [
                            {
                                platform: "skype",
                                speech: "Something went wrong",
                                type: 0
                            }
                        ]
                    };
                    res.json(response).end();
                });
                break;
            case "claim.getdateandtime":
                console.log("inside: claim.getdateandtime");
                console.log('context', req.body.result.contexts[0]);
                var response = {};
                var policyTypes = {};
                var effectiveDate = Date.parse(req.body.result.contexts[0].parameters.effectiveDate);
                var expirationDate = Date.parse(req.body.result.contexts[0].parameters.expirationDate);
                var IncidentDate = Date.parse(req.body.result.parameters.IncidentDate);

                console.log("Policy effective date: " + effectiveDate + ", IncidentDate: " + req.body.result.parameters.IncidentDate);

                console.log("effectiveDate: " + effectiveDate + " , expirationDate: " + expirationDate + ", IncidentDate:" + IncidentDate);

                if ((IncidentDate <= expirationDate && IncidentDate >= effectiveDate)) {
                    console.log("success: incident date falls between effective date and expiration date.");
                    return helper.getPolicyTypes().then((result) => {
                        policyTypes = result;
                        response = {
                            messages: [
                                {
                                    platform: "skype",
                                    speech: "Sure, thank you",
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
                                    buttons: policyTypes
                                }
                            ]
                        };
                        console.log('final response succ', response);
                        res.json(response).end();
                    }).catch((err) => {
                        console.log('error getting policy types', err);
                        response = {
                            messages: [
                                {
                                    platform: "skype",
                                    speech: "Something went wrong",
                                    type: 0
                                }
                            ]
                        };
                        res.json(response).end();
                    });
                } else {
                    console.log('failed: Incident date should fall between effective date and expiry date.');
                    response = {
                        messages: [
                            {
                                platform: "skype",
                                speech: "Incident date should fall between effective date and expiry date.",
                                type: 0
                            }
                        ]
                    };
                    res.json(response).end();
                }
                break;
            case "claim.getcauseofdamage":
                console.log("inside: claim.getcauseofdamage-no-custom-yes");
                console.log('context', req.body.result.contexts[0]);
                var message = "";
                var policyNumber = req.body.result.contexts[0].parameters.PolicyNumber;
                var lossdate = req.body.result.contexts[0].parameters.searchpolicyinfo[0].effectiveDate;
                var losscause = req.body.result.contexts[0].parameters.causeofdamage;
                return helper.createTempClaim(policyNumber, lossdate, losscause).then((result) => {
                    console.log('create temp claim result', result);
                    var claimNumber = result.claimNumber;
                    res.json({
                        messages: [
                            {
                                platform: "skype",
                                speech: "Sorry to hear about the accident! ;-( Was anyone injured in the accident?",
                                type: 0
                            },
                            {
                                platform: "skype",
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
                        ],
                        contextOut: [
                            {
                                name: "tempclaim-info",
                                parameters: {
                                    tempclaiminfo: result
                                },
                                lifespan: 5
                            }
                        ]
                    }).end();
                }).catch((err) => {
                    console.log('create temp claim error', err);
                    message = "Something went wrong while creating temporary claim.";
                    res.json({
                        messages: [
                            {
                                platform: "skype",
                                speech: message,
                                type: 0
                            }
                        ]
                    }).end();
                })
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
                return helper.getVehicleParts().then((result) => {
                    console.log('vehicle part final result', result);
                    res.json({
                        messages: [
                            {
                                platform: "skype",
                                speech: "I have made a note, Now can you please indicate which all parts of the vehicle were damaged in the accident?",
                                type: 0
                            },
                            {
                                platform: "skype",
                                title: "Please select",
                                type: 1,
                                imageUrl: baseUrl + "images/auto-body-parts.png",
                                buttons: result
                            }
                        ]
                    }).end();
                }).catch((err) => {
                    console.log('vehicle part error', err);
                    res.json({
                        messages: [
                            {
                                platform: "skype",
                                speech: "Failed to retrieve vehicle parts",
                                type: 0
                            }
                        ]
                    }).end();
                });
                break;
            case "claim.getpolicynumber":
                var out = {};
                var policyNumber = req.body.result.parameters.PolicyNumber + "";
                console.log("policyNumber:" + policyNumber);
                if (policyNumber.length == 8) {
                    policyNumber = (policyNumber.replace(/(\d{2})(\d{6})/, "$1-$2"));
                    console.log("valid policy number " + policyNumber);
                    return helper.searchPolicies(policyNumber).then((result) => {
                        console.log(result);
                        if (result.length) {
                            console.log("valid policuy num");

                            var effectiveDate = new Date(result[0].effectiveDate);
                            var effectiveDateMonth;
                            if (effectiveDate.getMonth() < 9) {
                                effectiveDateMonth = effectiveDate.getMonth() + 1;
                                effectiveDateMonth = "0" + effectiveDateMonth;
                            } else {
                                effectiveDateMonth = effectiveDate.getMonth() + 1;
                            }
                            effectiveDate = effectiveDate.getFullYear() + '-' + effectiveDateMonth + '-' + effectiveDate.getDate();

                            var expirationDate = new Date(result[0].expirationDate);
                            var expirationDateMonth;
                            if (expirationDate.getMonth() < 9) {
                                expirationDateMonth = expirationDate.getMonth() + 1;
                                expirationDateMonth = "0" + expirationDateMonth;
                            } else {
                                expirationDateMonth = expirationDate.getMonth() + 1;
                            }
                            expirationDate = expirationDate.getFullYear() + '-' + expirationDateMonth + '-' + expirationDate.getDate();

                            var policyType = result[0].policyType;
                            console.log("effectiveDate:" + effectiveDate + ", Policytype: " + policyType + ", expirationDate:" + expirationDate);
                            res.json({
                                messages: [
                                    {
                                        platform: "skype",
                                        speech: "Thanks for sharing the information.",
                                        type: 0
                                    }, {
                                        platform: "skype",
                                        speech: "Please can I have your Date of Incident(example format:-2018-01-19).",
                                        type: 0
                                    }],
                                contextOut: [
                                    {
                                        name: "policy-info",
                                        parameters: {
                                            effectiveDate: effectiveDate,
                                            expirationDate: expirationDate,
                                            policyType: policyType,
                                            PolicyNumber: policyNumber,
                                            searchpolicyinfo: result
                                        },
                                        lifespan: 5
                                    }
                                ]
                            }).end();
                        } else {
                            console.log("invalid policuy num");
                            res.json({
                                messages: [
                                    {
                                        platform: "skype",
                                        speech: "Please provide a valid policy number!.",
                                        type: 0
                                    }],
                                actionIncomplete: true
                            });
                        }
                    }).catch((err) => {
                        console.log(err);
                        res.json({
                            messages: [
                                {
                                    platform: "skype",
                                    speech: "Something went wrong!.",
                                    type: 0
                                }],
                            actionIncomplete: true
                        }).end();
                    })
                } else {
                    console.log("policy number length not correct");
                    res.json({
                        messages: [
                            {
                                platform: "skype",
                                speech: "Please provide a valid policy number.",
                                type: 0
                            }],
                        actionIncomplete: true
                    }).end();
                }
                break;
            case "claimgetdamagedparts.claimgetdamagedparts-yes":
                console.log("inside claimgetdamagedparts.claimgetdamagedparts-yes");
                return helper.getVehicleParts().then((result) => {
                    console.log('vehicle part final result', result);
                    res.json({
                        messages: [
                            {
                                platform: "skype",
                                speech: "Would you please indicate the damage to third party vehicle",
                                type: 0
                            },
                            {
                                platform: "skype",
                                title: "Please select",
                                type: 1,
                                imageUrl: baseUrl + "images/auto-body-parts.png",
                                buttons: result
                            }
                        ]
                    }).end();
                }).catch((err) => {
                    console.log('vehicle part error', err);
                    res.json({
                        messages: [
                            {
                                platform: "skype",
                                speech: "Failed to retrieve vehicle parts",
                                type: 0
                            }
                        ]
                    }).end();
                });
                break;
            case "claimgetdamagedparts.claimgetdamagedparts-yes.claimgetdamagedparts-yes-getthirdpartydamagedparts":
                console.log("inside claimgetdamagedparts.claimgetdamagedparts-yes.claimgetdamagedparts-yes-getthirdpartydamagedparts");
                res.json({
                    messages: [
                        {
                            platform: "skype",
                            speech: "Do you need any third party assitance",
                            type: 0
                        },
                        {
                            platform: "skype",
                            subtitle: "",
                            title: "Please select",
                            type: 1,
                            buttons: [
                                {
                                    postback: "Rented Vehicle",
                                    text: "Rented Vehicle"
                                },
                                {
                                    postback: "Towing Assistance",
                                    text: "Towing Assistance"
                                },
                                {
                                    postback: "Repair Workshop",
                                    text: "Repair Workshop"
                                }
                            ]
                        }
                    ]
                }).end();
                break;
            case "claim.getthirdpaartyassistanceinfo":
                console.log("inside claim.getthirdpaartyassistanceinfo");
                console.log('context', JSON.stringify(req.body.result.contexts));
                var tempClaimInfo = req.body.result.contexts[1].parameters.tempclaiminfo;
                var policyInfo = req.body.result.contexts[2].parameters.searchpolicyinfo[0];
                var damageDescription = req.body.result.contexts[0].parameters.partsofvehicle + ", " + req.body.result.contexts[3].parameters.partsofvehicle;

                tempClaimInfo.lobs.personalAuto.vehicleIncidents.push({
                    "damageDescription": damageDescription,
                    "driver": {
                        "contactName": "Cheryl Mills",
                        "firstName": "Cheryl",
                        "lastName": "Mills",
                        "policyRole": "driver"
                    },
                    "vehicle": {
                        "licensePlate": "2GDH967",
                        "make": "Toyota",
                        "model": "Corolla",
                        "state": "CA",
                        "vIN": "3DGF78575GD892534",
                        "year": 1996,
                        "country": "US"
                    }
                });

                return helper.submitClaim(tempClaimInfo, policyInfo).then((result) => {
                    res.json({
                        messages: [
                            {
                                platform: "skype",
                                speech: "Thanks for sharing the information.Your claim has been initiated and your claim registration number is " + result.claimNumber + ". You will shortly receive a call from our Claims Team who will assist you further. ",
                                type: 0
                            },
                            {
                                platform: "skype",
                                speech: "Is there anything else that I may help you with?",
                                type: 0
                            }]
                    }).end();
                }).catch((err) => {
                    console.log("error here", err);
                    res.json({
                        messages: [
                            {
                                platform: "skype",
                                speech: "Something went wrong when submitting the claim",
                                type: 0
                            }]
                    }).end();
                });
                break;
        }
    }
})

app.get('/test', (req, res) => {
    res.send(req.headers.host);
});

app.listen(REST_PORT, function () {
    console.log('Rest service ready on port ' + REST_PORT);
});

function getBaseUrl(req) {
    return req.protocol + '://' + req.headers.host + '/';
}