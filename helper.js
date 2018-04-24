var request = require("request");
var config = require('./config');

module.exports = {
    "getPolicyTypes": function () {
        return new Promise(function (resolve, reject) {
            console.log('getClaimPaymentDetails');
            var options = {
                method: 'POST',
                url: config.base_url + 'cc/service/edge/hexaware/common',
                headers:
                    {
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
    "searchPolicies": function (policyNumber) {
        return new Promise(function (resolve, reject) {
            console.log('getClaimPaymentDetails');
            var options = {
                method: 'POST',
                url: config.base_url + 'cc/service/edge/fnol/policy',
                headers:
                    {
                        'cache-control': 'no-cache',
                        'content-type': 'application/json',
                        authorization: 'Basic c3U6Z3c='
                    },
                body:
                    {
                        jsonrpc: '2.0',
                        method: 'searchPolicies',
                        params: [{ policyNumber: policyNumber }]
                    },
                json: true
            };
            console.log(JSON.stringify(options));
            request(JSON.parse(JSON.stringify(options)), function (error, response, body) {
                if (error) {
                    console.log('error', error);
                    console.log('response', response);
                    reject(error);
                } else {
                    console.log('body',body);
                    resolve(body.result);
                }
            });
        });
    }
};