var request = require("request");
var config = require('./config');
var lodash = require('lodash');

module.exports = {
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
                    console.log('body', body);
                    resolve(body.result);
                }
            });
        });
    },
    "getLossType": function () {
        return new Promise(function (resolve, reject) {
            console.log('getLossType');
            var options = {
                method: 'POST',
                url: config.base_url + 'cc/service/edge/hexaware/common',
                headers:
                    {
                        'cache-control': 'no-cache',
                        'content-type': 'application/json',
                        authorization: 'Basic c3U6Z3c='
                    },
                body: { jsonrpc: '2.0', method: 'getLossType', params: [] },
                json: true
            };
            console.log(JSON.stringify(options));
            request(JSON.parse(JSON.stringify(options)), function (error, response, body) {
                if (error) {
                    console.log('error', error);
                    console.log('response', response);
                    reject(error);
                } else {
                    var lossTypes = [];
                    lodash.forEach(body.result, function (value, key) {
                        lossTypes.push({
                            postback: value.code,
                            text: value.name
                        });
                    });
                    console.log('fro  helper losstypes', lossTypes);
                    resolve(lossTypes);
                }
            });
        });
    },
    "createTempClaim": function (policyNumber, lossdate, losscause) {
        return new Promise(function (resolve, reject) {
            console.log('getLossType');
            var options = {
                method: 'POST',
                url: config.base_url + 'cc/service/edge/fnol/fnol',
                headers:
                    {
                        'cache-control': 'no-cache',
                        'content-type': 'application/json',
                        authorization: 'Basic c3U6Z3c='
                    },
                body: {
                    jsonrpc: "2.0", method: "createClaim", params: [policyNumber, {
                        LossType: "AUTO",
                        LossDate: lossdate,
                        LossCause: losscause,
                        description: "testNewClaim"
                    }]
                },
                json: true
            };
            console.log(JSON.stringify(options));
            request(JSON.parse(JSON.stringify(options)), function (error, response, body) {
                if (error) {
                    console.log('create temp claim error', error);
                    console.log('response', response);
                    reject(error);
                } else {
                    console.log('create temp claim body', JSON.stringify(body.result));
                    resolve(body.result);
                }
            });
        });
    },
    "getPolicyTypes": function () {
        return new Promise(function (resolve, reject) {
            console.log('getPolicyTypes');
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
                    var policyTypes = [];
                    lodash.forEach(body.result, function (value, key) {
                        policyTypes.push({
                            postback: value.code,
                            text: value.name
                        });
                    });
                    console.log('from helper getpolicytypes', JSON.stringify(policyTypes));
                    resolve(policyTypes);
                }
            });
        });
    },
    "getVehicleParts": function () {
        return new Promise(function (resolve, reject) {
            console.log('getVehicleParts');
            var options = {
                method: 'POST',
                url: config.base_url + 'cc/service/edge/hexaware/common',
                headers:
                    {
                        'cache-control': 'no-cache',
                        'content-type': 'application/json',
                        authorization: 'Basic c3U6Z3c='
                    },
                body: { "jsonrpc": "2.0", "method": "getVehicleParts" },
                json: true
            }
            console.log(JSON.stringify(options));
            request(JSON.parse(JSON.stringify(options)), function (error, response, body) {
                if (error) {
                    console.log('error', error);
                    console.log('response', response);
                    reject(error);
                } else {
                    var vehicleParts = [];
                    lodash.forEach(body.result, function (value, key) {
                        vehicleParts.push({
                            postback: value.code,
                            text: value.name
                        });
                    });
                    console.log('fro  helper vehicleParts', vehicleParts);
                    resolve(vehicleParts);
                }
            });
        });
    },
    "submitClaim": function (tempClaimInfo, policyInfo, claimtype) {
        return new Promise(function (resolve, reject) {
            console.log('submitClaim');
            console.log("temp claim info", tempClaimInfo);
            var params = {
                "lossDate": "2018-04-01T00:00:00Z",
                "lossType": tempClaimInfo.lossType,
                "lossCause": "vehcollision",
                "description": tempClaimInfo.description,
                "claimNumber": tempClaimInfo.claimNumber,
                "claimType": claimtype,
                "policy": {
                    "policyNumber": policyInfo.policyNumber,
                    "policyType": policyInfo.policyType,
                    "expirationDate": policyInfo.expirationDate,
                    "effectiveDate": policyInfo.effectiveDate,
                    "status": "In force"
                },
                "mainContact": {
                    "contactName": policyInfo.insured,
                    "firstName": "Kristie",
                    "lastName": "Kristie",
                    "emailAddress1": "kristiekristie@gmail.com",
                    "workNumber": "530-225-3426",
                    "policyRole": "insured",
                    "primaryAddress": {
                        "addressLine1": policyInfo.address,
                        "addressLine3": "Street Sacramento",
                        "city": policyInfo.city,
                        "state": policyInfo.state,
                        "country": "US",
                        "postalCode": policyInfo.zip
                    }
                },
                "relatedContacts": tempClaimInfo.relatedContacts,
                "lobs": tempClaimInfo.lobs
            };

            var options = {
                method: 'POST',
                url: config.base_url + 'cc/service/edge/fnol/fnol',
                headers:
                    {
                        'cache-control': 'no-cache',
                        'content-type': 'application/json',
                        authorization: 'Basic c3U6Z3c='
                    },
                body: {
                    "jsonrpc": "2.0",
                    "method": "submitClaim",
                    "params": [params]
                },
                json: true
            };
            console.log("options", JSON.stringify(options));
            request(JSON.parse(JSON.stringify(options)), function (error, response, body) {
                if (error) {
                    console.log('error', error);
                    console.log('response', response);
                    reject(error);
                } else {
                    console.log('submit claim body', JSON.stringify(body.result));
                    resolve(body.result);
                }
            });
        });
    }
};