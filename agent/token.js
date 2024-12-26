const utils = require("../utils/index")

async function findToken(name,address) {
    if(name.split("$").length > 1)
    {
        name = name.split("$")[1]
    }
    if(!address || address?.length < 5)
    {
        const tk = await utils.api.findPumpBySearch(name);
        if(!tk || tk?.length == 0)
        {
            return false;
        }else{
            return {
                name:tk[0].name,
                symbol:tk[0].symbol,
                address:tk[0].mint,
                img:tk[0].image_uri
            };
        }
    }else{
        const tk = await utils.api.findPumpBySearch(address);
        if(!tk || tk?.length == 0)
        {
            return false;
        }else{
            return {
                name:tk[0].name,
                symbol:tk[0].symbol,
                address:tk[0].mint,
                img:tk[0].image_uri
            };
        }
    }
}

module.exports = {
    findToken
}