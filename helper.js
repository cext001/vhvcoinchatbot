var request = require("request");
var config = require('./config');
var lodash = require('lodash');

module.exports = {
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
                    resolve(body);
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
    "submitClaim": function () {
        return new Promise(function (resolve, reject) {
            console.log('submitClaim');
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
                    "params": [
                        {
                            "lossDate": "2018-04-01T00:00:00Z",
                            "lossType": "AUTO",
                            "lossCause": "vehcollision",
                            "description": "testNewClaim",
                            "claimType": "PACollisionCov",
                            "claimNumber": "999-99-999706",
                            "policy": {
                                "policyNumber": "54-123456",
                                "policyType": "PersonalAuto",
                                "expirationDate": "2018-01-20T00:00:00Z",
                                "effectiveDate": "2019-01-19T00:00:00Z",
                                "status": "In force"
                            },
                            "mainContact": {
                                "contactName": "Kristie Kristie",
                                "firstName": "Kristie",
                                "lastName": "Kristie",
                                "emailAddress1": "kristiekristie@gmail.com",
                                "workNumber": "530-225-3426",
                                "policyRole": "insured",
                                "primaryAddress": {
                                    "addressLine1": "1657 Riverside Drive Redding",
                                    "addressLine3": "Street Sacramento",
                                    "city": "Los Angeles",
                                    "state": "CA",
                                    "country": "US",
                                    "postalCode": "96001"
                                }
                            },
                            "relatedContacts": [
                                {
                                    "role": "pedestrian",
                                    "injured": false,
                                    "contact": {
                                        "contactName": "Tom Shannon",
                                        "firstName": "Tom",
                                        "lastName": "Shannon",
                                        "policyRole": "pedestrian"
                                    }
                                }
                            ],
                            "lobs": {
                                "personalAuto": {
                                    "vehicles": [
                                        {
                                            "licensePlate": "2GDH967",
                                            "make": "Toyota",
                                            "model": "Corolla",
                                            "state": "CA",
                                            "vIN": "3DGF78575GD892534",
                                            "year": 1996,
                                            "country": "US",
                                            "policyVehicle": true
                                        }
                                    ],
                                    "vehicleIncidents": [
                                        {
                                            "damageDescription": "Bonnet,Exposed Bumper (Front/Rear), Fascia",
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
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                },
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
    }
};