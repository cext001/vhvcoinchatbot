'use strict';

const express = require('express')
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.post('/api/messages', (req, res) => {
    console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
    res.json({
        "speech":"Sdsds",
        "messages": [
            {
                "buttons": [
                    {
                        "postback": "Card Link URL or text",
                        "text": "Card Link Title"
                    }
                ],
                "imageUrl": "http://urltoimage.com",
                "platform": "skype",
                "subtitle": "Card Subtitle",
                "title": "Card Title",
                "type": 1
            }
        ]
    });
})

app.listen(REST_PORT, function () {
    console.log('Rest service ready on port ' + REST_PORT);
});