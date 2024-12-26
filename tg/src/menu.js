const lan = require("./text")
const utils = require("../../utils/index")
const config = require("../../config.json");
const agent = require("../../agent/index")
require('dotenv').config()

const betConfig = {
    "marketcap":[
        {
            name:"Yes !",
            data:0,
        },
        {
            name:"No way .",
            data:1
        }
    ],
    "king_of_the_hill":[
        {
            name:"Sure !",
            data:0,
        },
        {
            name:"Nope .",
            data:1
        }
    ],
    "price_to_x":[
        {
            name:"Sure !",
            data:0,
        },
        {
            name:"No way .",
            data:1
        }
    ],
    "price_lever_to_n":[
        {
            name:"Sure !",
            data:0,
        },
        {
            name:"No way .",
            data:1
        }
    ],
    "price_up_or_down":[
        {
            name:"Up",
            data:0,
        },
        {
            name:"Down",
            data:1
        }
    ],
}

async function generate(bot, uid, req, data) {
    const aiGen = await agent.generateBets(req.params[0],uid);
    if(!aiGen || !aiGen.types)
    {
        return false;
    }

    const channelMsg =  await bot.sendPhoto(
        process.env.CHANNEL_ID,
        aiGen.tokenInfo.img,
        {
            caption:`
🍺 ${aiGen.words} 🎲
        `,
            parse_mode: 'MarkDown',
            disable_web_page_preview: "true",
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{
                        "text": betConfig[aiGen.types][0].name,
                        "url": `https://pumpbets.fun/api/redirect?id=${aiGen.id}`
                    }],
                    [{
                        "text": betConfig[aiGen.types][1].name,
                        "url": `https://pumpbets.fun/api/redirect?id=${aiGen.id}`
                    }],
                ]
            })
        }
    )

    return await bot.forwardMessage(uid, process.env.CHANNEL_ID, channelMsg.message_id, {});

}

module.exports = {
    generate
}