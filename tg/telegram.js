const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()
const token = process.env.TELEGRAMAPI;
const bot = new TelegramBot(token, { polling: true });

const src = require("./src/index")

bot.on('message', async(msg) => {
    try {
        if (msg["reply_to_message"]) {
            console.log(msg)
        } else {
            await router(msg)
        }
    } catch (e) {
        console.log(e);
    }

});

bot.on('callback_query', async function onCallbackQuery(callbackQuery) {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const opts = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
    };
    try {
        await callBackRouter(msg, action, opts);
    } catch (e) {
        console.log(e);
    }

});


async function router(data) {
    const uid = data.chat.id;
    const req = src.pathRouter(data.text);
    switch (req.command) {
        default:
            await src.menu.generate(bot, uid, req, data);
            break;
    }
}

async function callBackRouter(data, action, opts) {
    const uid = data.chat.id;
    const req = src.pathRouter(action);
    switch (req.command) {
        case "empty":
            return null;
        case "close":
            break;
        default:
            break;
    }
    bot.deleteMessage(opts.chat_id, opts.message_id);
}

async function sideBet(sign)
{
   await src.menu.sendKey(bot,sign)
}

async function init() {

}

function getBot() {
    return bot;
}

module.exports = {
    init,
    getBot,
    sideBet
}