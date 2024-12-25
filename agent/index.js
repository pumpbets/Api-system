const ai =require("openai");
const fs = require('fs');
const OpenAI =ai.OpenAI
var fsp = require('fs/promises');

const client = new OpenAI({
  apiKey: process.env.OPENAIKEY,
  baseURL:  process.env.OPENAPIURL,
  });
async function generate(msg) {
    const stream = await client.chat.completions.create({
        model: "default",
        messages: [
              {
                role: "user",
                content: `现在是${Date.now()}，请将以下信息重新格式成json形式，返回给我。要求格式：{
"token":"",
“types:"",
"bets":"",
"deadline":"",
"words":"",
"final":""
}，不允许返回json外的任意内容。
你将会收到一个关于用户 赌 某个代币的相关内容。你支持以下赌注：
1. 代币marketcap
2. 代币是否能到达自己曲线的'king of the hill'
3. 代币价格能否到x
4. 代币能否翻n倍
5. 代币价格会走高或走低
$token是用户提及的代币，需是Solana地址或一串string，
$types是用户要赌的赌约类型，支持以下类型：
marketcap，king_of_the_hill,price_to_x,price_lever_to_n,price_up_or_down
$bets是用户要赌的内容，根据不同赌约类型分别是：
marketcap=>number ; king_of_the_hill=>true/not ; price_to_x=>number ; price_lever_to_n=>number ; price_up_or_down=>0
$deadline是用户提及的截止时间，如果用户没有提及时间，回复default。deadline字段要求使用timestamp形式。
$words是你需要给用户提供的一串回复，该回复将会由我在twitter上reply用户。
$final是对这个赌约进行自然语言总结。如：Bet $token will reach king of hill 。
如果你认为用户说的内容，无法与上述类型进行匹配。请返回所有字段为空。切记使用英语回复。
现在，你收到以下内容。${msg}`,
              }
        ],
        venice_parameters: {
            include_venice_system_prompt: false,
          },
      });

      console.log(
        stream.choices[0].message.content
      )
      return stream.choices[0].message.content;
}


const generateBets = async(msg,sign)=>{
    const aiRet = {}
    let final = {}
    try{
        const _aiRet = JSON.parse(
            await generate(req.body.msg)
        )
        if(_aiRet && _aiRet?.token)
        {
            aiRet.deadline = Date.now()+(24*3600000)
            final =  {
                "id":uuid.v4(),//New UUID
                "originMessage":{
                    "msg":msg,
                    "sign":sign
                },
                "token": aiRet?.token,
                "types": aiRet?.types,
                "bets": aiRet?.bets,
                "deadline": aiRet?.deadline,
                "words": aiRet?.words,
                "final": aiRet?.final
            }
            await utils.db.newBet(final);
        }else{
            return await generateBets(msg)
        }
    }catch(e)
    {
        console.error(e)
        return false;
        // return await generateBets(msg)
    }
    
    
}


module.exports = {
    generate,
    generateBets
}