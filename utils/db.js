var MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
    //DB name
const mainDB = "pumpbet"

//Sheet name
const sBets = "bets"
const sPayments = "payments"
//DB struct
const betStruct = {
    "id":"",//New UUID
    "originMessage":{
        "msg":"",
        "sign":""
    },
    "token": "$funproxy",
    "types": "king_of_the_hill",
    "bets": "true",
    "deadline": "default",
    "words": "You bet $funproxy will reach king of the hill",
    "final": "Bet $funproxy will reach king of hill"
}



/**
 * Invoice
 */

async function finBetById(data) {
    const pool = await MongoClient.connect(process.env.SQL_HOST)
    var db = pool.db(mainDB);
    var ret = await db.collection(sBets).find({
        id: data
    }).project({
        _id:0,
    }).toArray();
    await pool.close();
    if (ret.length > 0) {
        return ret[0]
    }
    return false;
}

async function finBets(page = 1, limit = 10) {
    const pool = await MongoClient.connect(process.env.SQL_HOST, { useUnifiedTopology: true });
    try {
        const db = pool.db(mainDB);

        // Calculate the number of documents to skip for pagination
        const skip = (Number(page) - 1) * Number(limit);

        // Query for data with pagination
        const ret = await db.collection(sBets)
            .find(
                // {deadline: { $lt: Date.now() } }
            )
            .skip(skip)
            .limit(Number(limit))
            .project({ _id:0,}).toArray();

        await pool.close();

        // Return the results
        return ret.length > 0 ? ret : false;
    } catch (error) {
        console.error("Error fetching bets:", error);
        await pool.close();
        throw error;
    }
}


async function newBet(bet) {
    const pool = await MongoClient.connect(process.env.SQL_HOST)
    var db = pool.db(mainDB);
    var ret = await db.collection(sBets).insertOne(
        bet
    );
    await pool.close();
    return ret;
}

module.exports = {
    finBetById,
    finBets,
    newBet
}