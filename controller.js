const helper = require('./helper');

module.exports = {
    handlePolicyNumber: function (req, res) {
        console.log("Ssssssss");
        var out = {};
        var policyNumber = req.body.result.parameters.PolicyNumber + "";
        console.log("policyNumber:" + policyNumber);
        if (policyNumber.length == 8) {
            policyNumber = (tt.replace(/(\d{2})(\d{6})/, "$1-$2"));
            console.log("valid policy number " + policyNumber);
            return helper.searchPolicies(policyNumber).then((result) => {
                console.log(result);
                if (result.length) {
                    console.log("valid policuy num");
                    out = {
                        messages: [
                            {
                                platform: "skype",
                                speech: "Thanks for sharing the information.",
                                type: 0
                            }, {
                                platform: "skype",
                                speech: "Please can I have your Date of Incident and time of incident.",
                                type: 0
                            }]
                    };
                } else {
                    console.log("invalid policuy num");
                    out = {
                        messages: [
                            {
                                platform: "skype",
                                speech: "Please provide a valid policy number!.",
                                type: 0
                            }]
                    };
                }
            }).catch((err) => {
                console.log(err);
                out = {
                    messages: [
                        {
                            platform: "skype",
                            speech: "Something went wrong!.",
                            type: 0
                        }]
                };
            })
        } else {
            out = {
                messages: [
                    {
                        platform: "skype",
                        speech: "Please provide a valid policy number.",
                        type: 0
                    }]
            };
        }
        res.json(out).end();
    }
}

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