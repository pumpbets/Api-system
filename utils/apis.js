const req = require("./request");
require('dotenv').config()

const baseUrl = process.env.BASE_URL

const router = {
  newPaymentMethod:baseUrl+"setting/paymentmethod/new",
  getPaymentMethod:baseUrl+"setting/paymentmethod/get",
  newInvoices:baseUrl+"invoice/new",
  coinmarketcapQuotesById:"https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id="
}

async function anyRequest(url)
{
    var options = {
        'method': 'GET',
        'url': url,
        'headers': {
          'user-agent': ' Nodejs ',
          'Content-Type': 'application/json'
        },
      };
      return req.doRequest(options);
}

async function getPrice(id)
{
    var options = {
        'method': 'GET',
        'url': router.coinmarketcapQuotesById+id,
        'headers': {
          'Content-Type': 'application/json',
          'X-CMC_PRO_API_KEY':process.env.COINMARKETCAP_API
        },
      };
      return req.doRequest(options);
}

async function getTokenPrice(id)
{
    // BTC 1 / ETH 1027 / SOL 5426 / TON 11419
    const price = await getPrice(id);
    if(price && price?.data && price?.data[id]?.quote)
    {
        return price.data[id].quote.USD.price
    }
}

async function getTokensPrice()
{
    return{
        eth:await getTokenPrice(1027),
        sol:await getTokenPrice(5426),
        ton:await getTokenPrice(11419)
    }
}

async function findPumpBySearch(search) {
  const myHeaders = {
    "Origin": "",
    "Referer": "",
    "Host": "frontend-api-v2.pump.fun",
    "Cookie": "__cf_bm=SY.zi.Uf49IBcaJD4hKKd1g_UVJy.itBLgcm8PalB2o-1734681191-1.0.1.1-CxGdqM5W9Akoki1pb2vP6Ayj7Qot1ekVhfAMiDms0zDy7uKBby6Hb0rgqOaVIlKzaeIpT1mxZ2zUa5gI4rQCiA"
  };

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch(`https://frontend-api-v2.pump.fun/coins?offset=0&sort=market_cap&order=DESC&includeNsfw=false&searchTerm=${search}&limit=${1}`, requestOptions);
    return await response.json();
    
  } catch (error) {
    return false;
  }
}
module.exports = {
    anyRequest,
    getPrice,
    getTokensPrice,
    getTokenPrice,
    findPumpBySearch
}