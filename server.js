

var querystring = require('querystring');
var express = require('express');
const fs = require("fs");
const tg= require("./tg/telegram")
var bot;
var app = express();
var bodyParser = require('body-parser');
const cors = require('cors'); 

const agent = require("./agent/index")

const uuid = require('uuid');
const utils = require("./utils/index")
const blinks = require("./utils/blinks")

app.use(cors()); 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(6553, async function() {
    console.log('mock-server start')
})
app.get('/ping', async function(req, res) {
    res.status(200).send({
        "code": 200,
        "data": "pong"
    })
})

app.get('/list', async function(req, res) {
    try{
        res.status(200).send({
            "code": 200,
            "data": await utils.db.finBets(req.query?.page,req.query?.limit)
        })
    }catch(e)
    {
        return sendErr(res,e)
    }
})

app.get('/find', async function(req, res) {
    try{
        res.status(200).send({
            "code": 200,
            "data": await utils.db.finBetById(req.query.id)
        })
    }catch(e)
    {
        return sendErr(res,e)
    }
})
app.post('/new', async function(req, res) {
    var ret = await agent.generateBets(req.body.msg,req.body.sign)
    res.status(200).send({
        "code": 200,
        "data": ret
    })
})

app.get('/redirect', (req, res) => {

    const userAgent = req.get('User-Agent');
    const origin = req.get('Origin');
    console.log(userAgent);
    console.log(origin);
    if(origin == "https://dial.to")
        {
            console.log("This is a blinks request")
            return blinks.getBet(req,res)
        }
    if (userAgent && userAgent.includes('Twitterbot')) {
        console.log('Request is from Twitter preview');
        return twitterResponse(req,res)
      }
      return blinks.getBet(req,res)
  });
  

const twitterResponse = (req,res) => {
    const imageUrl = 'https://pumpbets.fun/logo.png';
    const title = 'Pumpbets';
    const description = 'First AI-Agent driven solana memecoin bets protocol';
    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>API Preview</title>
        
        <!-- Twitter Card meta tags -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${title}">
        <meta name="twitter:description" content="${description}">
        <meta name="twitter:image" content="${imageUrl}">
        <meta name="twitter:site" content="@pumpbetai"> 
        
        <!-- Optional: Open Graph meta tags for additional platforms -->
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${description}">
        <meta property="og:image" content="${imageUrl}">
        <meta property="og:url" content="http://pumpbets.fun/api">
        
      </head>
      <body>
        <h1>API Response Preview</h1>
        <p>Check how this API responds in Twitter preview.</p>
      </body>
      </html>
    `);
}

const sendErr = (res,err) =>{
    return res.status(500).send({
        "code": 500,
        "error": err
    })
}


async function init()
{
    // await tg.init();
    // bot = tg.getBot()
}

init()