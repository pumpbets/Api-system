const express = require('express');
const {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} = require('@solana/web3.js');
const { createPostResponse, actionCorsMiddleware } = require('@solana/actions');
const connection = new Connection(clusterApiUrl('mainnet-beta'));

const db = require("./db")

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
async function getBet(req, res) {
    try {
      const baseHref = `https://pumpbets.fun/api/blink/:${req.query.id}`;
      const bet =  await db.finBetById(req.query.id)
      console.log(bet)
      if(bet && betConfig[bet.types])
      {
        const payload = {
            type: 'action',
            title: bet.final,
            icon: bet.tokenInfo.img,
            description: `
      🎉 ${bet.words}
    
      ${bet.token}
      ${bet.address}
    
            `,
            links: {
              actions: [
                {
                  label: betConfig[bet.types][0].name,
                  href: `${baseHref}?type=0`,
                  parameters: [
                  ],
                  
                },
                {
                    label: betConfig[bet.types][1].name,
                    href: `${baseHref}?type=1`,
                    parameters: [
                    ],
                    
                  },
              ],
            },
          };
      
          res.json(payload);
      }

    } catch (err) {
      console.error(err);
      // handleError(res, err);
      res.status(500).json({ message: err?.message || err });
    }
  }
async function betTransaction(req, res) {
  try {
    const { amount, name } = validatedQueryParams(req.query);
    const { account } = req.body;
    const toPubkey = new PublicKey("B75hp4bHXGxP9CWs5RN363d5t8dJYLjAc28qK9o1MXDS");
    if (!account) {
      throw new Error('Invalid "account" provided');
    }

    const fromPubkey = new PublicKey(account);
    const minimumBalance = await connection.getMinimumBalanceForRentExemption(0);

    if (amount * LAMPORTS_PER_SOL < minimumBalance) {
      throw new Error(`Account may not be rent exempt: ${toPubkey.toBase58()}`);
    }

    const transferSolInstruction = SystemProgram.transfer({
      fromPubkey: fromPubkey,
      toPubkey: toPubkey,
      lamports: amount,
    });

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();


    const transaction = new Transaction({
      feePayer: fromPubkey,
      blockhash,
      lastValidBlockHeight,
    }).add(transferSolInstruction);

    const payload = await createPostResponse({
      fields: {
        transaction,
        message: `Send ${amount} SOL to ${toPubkey.toBase58()}`,
      },
    });
    console.log(payload);
    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'An unknown error occurred' });
  }
}

module.exports = {
    getBet,
    betTransaction
}