var request = require("request");

module.exports = {
    "getPolicyTypes": function () {
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
    }
};