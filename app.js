'use strict';
const express = require('express')
const bodyParser = require('body-parser');
const helper = require('./helper');
const controller = require('./controller');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

const REST_PORT = process.env.PORT || 3000;

app.post('/api/messages', (req, res) => {
    console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
    if (req.body.result) {
        console.log("Action: " + req.body.result.action + ", Intent: " + req.body.result.metadata.intentName);
        switch (req.body.result.action) {
            case "claim.getdateandtime":
                console.log("inside: claim.getdateandtime");
                console.log('context', req.body.result.contexts[0]);
                var response = {};
                var lossTypes = {};
                var effectiveDate = new Date(req.body.result.contexts[0].parameters.effectiveDate);
                var selectedPolicyType = req.body.result.contexts[0].parameters.policyType;
                var effectiveDateMonth;
                if (effectiveDate.getMonth() < 9) {
                    effectiveDateMonth = effectiveDate.getMonth() + 1;
                    effectiveDateMonth = "0" + effectiveDateMonth;
                } else {
                    effectiveDateMonth = effectiveDate.getMonth() + 1;
                }
                effectiveDate = effectiveDate.getFullYear() + '-' + effectiveDateMonth + '-' + effectiveDate.getDate();
                console.log("Policy effective date: " + effectiveDate + ", IncidentDate: " + req.body.result.parameters.IncidentDate + ", Incident Time: " + req.body.result.parameters.IncidentTime);
                if (req.body.result.parameters.IncidentDate != effectiveDate) {
                    console.log("date not matches with policy date");
                    res.json({
                        messages: [
                            {
                                platform: "skype",
                                speech: "Invalid date provided.",
                                type: 0
                            },
                        ],
                        actionIncomplete: true
                    }).end();
                } else {
                    console.log("date matches with policy date");
                    return helper.getLossType().then((result) => {
                        lossTypes = result;
                        response = {
                            messages: [
                                {
                                    platform: "skype",
                                    speech: "Selected policy type is: " + selectedPolicyType,
                                    type: 0
                                },
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
                                    imageUrl: "http://pb-attorneys.com/wp-content/uploads/2015/08/2-car-crash-1.jpg",
                                    buttons: lossTypes
                                }
                            ]
                        };
                        console.log('final response succ', response);
                        res.json(response).end();
                    }).catch((err) => {
                        console.log('error', err);
                        response = {
                            messages: [
                                {
                                    platform: "skype",
                                    speech: "Something went wrong",
                                    type: 0
                                }
                            ]
                        };
                        console.log('final response errr', response);
                        res.json(response).end();
                    })
                }
                break;
            case "claim.getcauseofdamage":
                console.log("inside: claim.getcauseofdamage-no-custom-yes");
                console.log('context', req.body.result.contexts[0]);
                var message = "";
                var policyNumber = req.body.result.contexts[0].parameters.PolicyNumber;
                var lossdate = req.body.result.contexts[0].parameters.IncidentDate;
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
                                imageUrl: "https://sparesboyz.com/wp-content/uploads/2017/07/Auto-Body-Parts.png",
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
                /*console.log("insider claim.getpolicynumber");
                controller.handlePolicyNumber;*/
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
                            var date = new Date(result[0].effectiveDate);
                            date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                            var policyType = result[0].policyType;
                            console.log("Date:" + date + ", Policytype: " + policyType);
                            res.json({
                                messages: [
                                    {
                                        platform: "skype",
                                        speech: "Thanks for sharing the information.",
                                        type: 0
                                    }, {
                                        platform: "skype",
                                        speech: "Please can I have your Date of Incident and time of incident.",
                                        type: 0
                                    }],
                                contextOut: [
                                    {
                                        name: "policy-info",
                                        parameters: {
                                            effectiveDate: date,
                                            policyType: policyType,
                                            PolicyNumber: policyNumber
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
                console.log("inside claimgetdamagedparts.claimgetdamagedparts-yes XXXXXXXXXXXXXXx");
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
                                imageUrl: "https://sparesboyz.com/wp-content/uploads/2017/07/Auto-Body-Parts.png",
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
                console.log('context', JSON.stringify(req.body.result.contexts[0]));
                break;
        }
    }
})

app.get('/test', (req, res) => {
    return helper.getClaimPaymentDetails().then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err);
    })
    res.send("aaa");
});

app.listen(REST_PORT, function () {
    console.log('Rest service ready on port ' + REST_PORT);
});