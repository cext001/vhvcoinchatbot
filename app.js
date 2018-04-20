'use strict';

const express = require('express')
const app = express()
const REST_PORT = process.env.PORT || 5000;

app.post('/chat', (req, res) => {
    console.log(req);
    if (req.body.queryResult.action = "claim.raiseissue") {
        res.json({"messages": [
            {
              "speech": "Text response",
              "type": 0
            }
          ]});
    }
   // res.send('Hello World!');
})

app.listen(REST_PORT, function () {
    console.log('Rest service ready on port ' + REST_PORT);
});
