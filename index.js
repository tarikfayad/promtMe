var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

var GoogleSpreadsheet = require('google-spreadsheet');

var doc = new GoogleSpreadsheet('1Pv5SK6COZkc_H4jQ1B9HUqObhcGv7vbcE-3Wn5iZ5IQ');
var sheet;

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            if (text === 'Prompt') {
                sendPromptMessage(sender, randomPrompt)
                continue
            }
            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})

var token = "EAAQgw1ouaYkBABhZAJDDlX5XzI6BeaDn0n7HpW6HuA1yfeekEnfcF9iqNALMyrfV714MqWhVf7V3ZCWTfkDZACEMWHRzQzYESbOrFeOGojZCeVYQ8kMUnPqqyIkMUmqD6p0VIMRaGZAZA7Pfgo3LmWLd6cgB5F1MH1uWjjpCRN9QZDZD"

//Message sending functions
function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendPromptMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

//Google Sheets
function randomPrompt {
    var randomNumber = (Math.floor(Math.random() * 102)) + 1;
    
    sheet.getCells({
        'min-row': randomNumber,
        'max-row': randomNumber,
        'return-empty': false
    }, function(err, cells) {
        var cell = cells[0];
        return cell.value;
    });
}