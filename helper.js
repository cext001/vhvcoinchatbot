var request = require("request");

module.exports = {
    "getClaimPaymentDetails": function () {
        return new Promise(function (resolve, reject) {
            console.log('getClaimPaymentDetails');
            var options = {
                method: 'POST',
                url: 'http://35.154.116.87:8080/cc/service/edge/hexaware/common',
                headers:
                    {
                        'postman-token': '08b5f2c7-dc7d-7190-d81f-1294d29a4da5',
                        'cache-control': 'no-cache',
                        'content-type': 'application/json',
                        authorization: 'Basic c3U6Z3c='
                    },
                body: { jsonrpc: '2.0', method: 'getPolicyTypes', params: [] },
                json: true
            }
            console.log(JSON.stringify(options));
            request(JSON.parse(JSON.stringify(options)), function (error, response, body) {
                if (error) {
                    console.log('error', error);
                    console.log('response', response);
                    reject(error);
                } else {
                    console.log(body);
                    resolve(body);
                }
            });
        });
    },
    "getClaimStatus": function (claimId) {
        var speechOutput = [];
        console.log('InsideHelper Claim Id:', claimId);
        return new Promise(function (resolve, reject) {
            var options = {
                method: 'POST',
                url: 'http://35.154.116.87:8080/cc/service/edge/claim/vhv',
                headers: { 'cache-control': 'no-cache', authorization: 'Basic c3U6Z3c=', 'content-type': 'application/json' },
                body: { jsonrpc: '2.0', method: 'getClaimSummary', params: [claimId] },
                json: true
            };
            request(options, function (error, response, body) {
                if (error) {
                    console.log(error);
                    speechOutput = ["<s>Something went wrong.</s><s> Please try again</s>"];
                    resolve(speechOutput);
                } else {
                    if (body.error) {
                        console.log('Inside body error', body.error.message);
                        if (body.error.message == 'No Claim entity found')
                            speechOutput = ['<s>The claim number is not found.</s><s>Please enter a valid one</s>'];
                    } else {
                        speechOutput = ["<s>According to our records, the current status of claim with ID <break strength=\"medium\" /> <say-as interpret-as=\"digits\"> " + claimId + " </say-as>, is " + body.result.currentClaimStatus + ".</s>"];
                        if (body.result.currentClaimStatus === "On Hold") {
                            speechOutput.push('<s>The reason for the same is <break strength=\"medium\" />' + body.result.reason + '.</s>');
                        }
                    }
                    console.log(speechOutput);
                    resolve(speechOutput);
                }
            });
        })
    }
};