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
                var effectiveDate = req.body.result.contexts[0].parameters.effectiveDate;
                var expirationDate = req.body.result.contexts[0].parameters.expirationDate;
                var selectedPolicyType = req.body.result.contexts[0].parameters.policyType;

                console.log("Policy effective date: " + effectiveDate + ", IncidentDate: " + req.body.result.parameters.IncidentDate + ", Incident Time: " + req.body.result.parameters.IncidentTime);

                var dateFrom = effectiveDate;
                var dateTo = "02-09-2013";
                var IncidentDate = req.body.result.parameters.IncidentDate;

                var d1 = effectiveDate.split("-");
                var d2 = expirationDate.split("-");
                var c = IncidentDate.split("-");

                var from = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]);
                var to = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);
                var check = new Date(c[2], parseInt(c[1]) - 1, c[0]);

                console.log("check: " + check + ",from:" + from + ",to:" + to);

                if (check > from && check < to) {
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
                    console.log("Incident date should fall within effective date and expiration date.");
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
                                        speech: "Please can I have your Date of Incident and time of incident.",
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
                console.log('context', JSON.stringify(req.body.result.contexts));
                var tempClaimInfo = req.body.result.contexts[1].parameters.tempclaiminfo;
                var policyInfo = req.body.result.contexts[2].parameters.searchpolicyinfo[0];
                var damageDescription = req.body.result.contexts[0].parameters.partsofvehicle + ", " + req.body.result.contexts[3].parameters.partsofvehicle;
                console.log("policyInfo", policyInfo);
                /*return helper.submitClaim(tempClaimInfo, policyInfo, damageDescription).then((result) => {
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
                    console.log("error here",err);
                    res.json({
                        messages: [
                            {
                                platform: "skype",
                                speech: "Something went wrong when submitting the claim",
                                type: 0
                            }]
                    }).end();
                })*/
                res.json({
                    messages: [
                        {
                            platform: "skype",
                            speech: "Thanks for sharing the information.Your claim has been initiated and your claim registration number is " + tempClaimInfo.claimNumber + ". You will shortly receive a call from our Claims Team who will assist you further. ",
                            type: 0
                        },
                        {
                            platform: "skype",
                            speech: "Is there anything else that I may help you with?",
                            type: 0
                        }]
                }).end();
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