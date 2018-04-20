'use strict';

const express = require('express')
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

const REST_PORT = process.env.PORT || 8080;

app.post('/api/messages', (req, res) => {
    console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
    if (req.body.queryResult) {
        console.log("Action: "+req.body.queryResult.action);
        if (req.body.queryResult.action === "claim.raiseissue") {
            console.log("inside: claim.raiseissue");
            res.json({
                "speech": "",
                "displayText": "",
                "data": {
                  
                },
                "contextOut": [
                  
                ],
                "source": "Webhook",
                "messages": [
                  {
                    "type": 4,
                    "platform": "skype",
                    "speech": "",
                    "payload": {
                      "skype": {
                        "attachmentLayout": "list",
                        "attachments": [
                          {
                            "contentType": "application\/vnd.microsoft.card.hero",
                            "content": {
                              "title": "Unit 2A",
                              "subtitle": "",
                              "text": "These timeslots are available for 2017-10-16",
                              "images": [
                                
                              ],
                              "buttons": [
                                {
                                  "type": "imBack",
                                  "title": "from 13:00 until 14:00 Unit 2A",
                                  "value": "from 13:00 until 14:00 Unit 2A"
                                },
                                {
                                  "type": "imBack",
                                  "title": "from 14:00 until 15:00 Unit 2A",
                                  "value": "from 14:00 until 15:00 Unit 2A"
                                },
                                {
                                  "type": "imBack",
                                  "title": "from 15:00 until 16:00 Unit 2A",
                                  "value": "from 15:00 until 16:00 Unit 2A"
                                }
                              ]
                            }
                          },
                          {
                            "contentType": "application\/vnd.microsoft.card.hero",
                            "content": {
                              "title": "Unit 1",
                              "subtitle": "",
                              "text": "These timeslots are available for 2017-10-16",
                              "images": [
                                
                              ],
                              "buttons": [
                                {
                                  "type": "imBack",
                                  "title": "from 13:00 until 14:00 Unit 1",
                                  "value": "from 13:00 until 14:00 Unit 1"
                                },
                                {
                                  "type": "imBack",
                                  "title": "from 14:00 until 15:00 Unit 1",
                                  "value": "from 14:00 until 15:00 Unit 1"
                                },
                                {
                                  "type": "imBack",
                                  "title": "from 15:00 until 16:00 Unit 1",
                                  "value": "from 15:00 until 16:00 Unit 1"
                                },
                                {
                                  "type": "imBack",
                                  "title": "from 16:00 until 17:00 Unit 1",
                                  "value": "from 16:00 until 17:00 Unit 1"
                                }
                              ]
                            }
                          }
                        ]
                      }
                    }
                  }
                ]
              }).end();
        }
    }
})

app.listen(REST_PORT, function () {
    console.log('Rest service ready on port ' + REST_PORT);
});