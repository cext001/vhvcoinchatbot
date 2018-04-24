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