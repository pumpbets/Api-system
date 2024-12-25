

var querystring = require('querystring');
var express = require('express');
const fs = require("fs");
const tg= require("./tg/telegram")
var bot;
var app = express();
var bodyParser = require('body-parser');

const agent = require("./agent/index")

const uuid = require('uuid');
const utils = require("./utils/index")

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
app.post('/generate', async function(req, res) {
    var ret = await agent.generateBets(req.body.msg,req.body.sign)
    res.status(200).send({
        "code": 200,
        "data": JSON.parse(ret)
    })
})

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