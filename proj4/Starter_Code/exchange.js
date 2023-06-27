// =================== CS251 DEX Project =================== // 
//        @authors: Simon Tao '22, Mathew Hogan '22          //
// ========================================================= //                  
//const Web3 = require('web3'); 

//const { addABI } = require("abi-decoder");

// sets up web3.js
//const fs = require('fs')
//const assert = require('assert')
//const { bigInt } = require('snarkjs')
//const crypto = require('crypto')
//const Web3 = require('web3')
//const { toWei } = require('web3-utils')
const web3 = new Web3("ws://127.0.0.1:8545/");
//const mimc = require("./src/mimc");
//const compute_spend_input = require("./src/compute_spend_inputs");

const exchange_name = "Gnsahk"; // TODO: fill in the name of your exchange

const token_name = "Khang";             // TODO: replace with name of your token
const token_symbol = "KHA";   

const AMOUNT = '100';
const netId = 6;

let give_code = "underfi";
            // TODO: replace with symbol for your token

var BN = web3.utils.BN;


// =============================================================================
//         ABIs and Contract Addresses: Paste Your ABIs/Addresses Here
// =============================================================================
// TODO: Paste your token contract address and ABI here:
const token_address = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';                   
const token_abi = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol_",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      }
    ],
    "name": "TranferDone",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_disable_mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "_mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_ownerVirtual",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "aa",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] ;
const token_contract = new web3.eth.Contract(token_abi, token_address);

// TODO: Paste your exchange address and ABI here
const exchange_abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountToken",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountETH",
        "type": "uint256"
      }
    ],
    "name": "AddLiquidity",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "s",
        "type": "string"
      }
    ],
    "name": "StringToUint",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "commitment",
        "type": "string"
      }
    ],
    "name": "addLiquidity",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountETH",
        "type": "uint256"
      }
    ],
    "name": "amountETHGivenToken",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountToken",
        "type": "uint256"
      }
    ],
    "name": "amountTokenGivenETH",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountTokens",
        "type": "uint256"
      }
    ],
    "name": "createPool",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "eth_reserves",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "commitment",
        "type": "string"
      }
    ],
    "name": "haveCommitment",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "k",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "notificationError",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "priceETH",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "priceToken",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rallyCommitment",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "rally_commitments",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "commitment",
        "type": "string"
      }
    ],
    "name": "swapETHForTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_commitment",
        "type": "string"
      }
    ],
    "name": "swapTokensForETH",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "swap_fee_denominator",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "swap_fee_numerator",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token_reserves",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "verifier",
    "outputs": [
      {
        "internalType": "contract IVerifier",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_recipient",
        "type": "address"
      },
      {
        "internalType": "uint256[]",
        "name": "p",
        "type": "uint256[]"
      },
      {
        "internalType": "string",
        "name": "digest",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "nullifier",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "commitment",
        "type": "string"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

const exchange_address = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';                
const exchange_contract = new web3.eth.Contract(exchange_abi, exchange_address);

var defaultAccount;

const amountTokens = 100;

const amountETH = 100;

// =============================================================================
//                              Provided Functions
// =============================================================================
// Reading and understanding these should help you implement the below functions

const rbigint = (Max) => Math.floor(Math.random() * Max) + 1;
// res = BigInt(0);
//   console.log(rbigint(31));

//  byte[] by
async function init() {
  
  var poolState = await getPoolState();
  if (poolState['token_liquidity'] === 0
          && poolState['eth_liquidity'] === 0) {
      // Call mint twice to make sure mint can be called mutliple times prior to disable_mint
      const total_supply = 10000000000;
  await token_contract.methods._mint(total_supply / 2).send({from:web3.eth.defaultAccount, gas : 999999});
  await token_contract.methods._mint(total_supply / 2).send({from:web3.eth.defaultAccount, gas : 999999});
  await token_contract.methods._disable_mint().send({from:web3.eth.defaultAccount, gas : 999999});
      await token_contract.methods.approve(exchange_address, total_supply).send({from:web3.eth.defaultAccount});
      // initialize pool with equal amounts of ETH and tokens, so exchange rate begins as 1:1
      await exchange_contract.methods.createPool(total_supply).send({from:web3.eth.defaultAccount, value : total_supply, gas : 999999});

      // All accounts start with 0 of your tokens. Thus, be sure to swap before adding liquidity.
  }
}
async function anit() {
  
  var poolState = await getPoolState();
  console.log(poolState['token_liquidity']);
  console.log(poolState['eth_liquidity']);
}

async function getPoolState() {
    // read pool balance for each type of liquidity
    
//console.log(await web3.eth.defaultAccount);
    const gg= await token_contract.methods.aa().call({from:web3.eth.defaultAccount});
    
    let liquidity_tokens = await exchange_contract.methods.token_reserves().call({from:web3.eth.defaultAccount});
    
    let liquidity_eth = await exchange_contract.methods.eth_reserves().call({from:web3.eth.defaultAccount});
    const ff= await exchange_contract.methods.k().call({from:web3.eth.defaultAccount});
    //console.log(gg,ff);
    let amountTokenGivenETH = await exchange_contract.methods.amountTokenGivenETH(amountTokens).call({from:web3.eth.defaultAccount});
    //console.log(gg,ff);
    let amountETHGivenToken = await exchange_contract.methods.amountTokenGivenETH(amountETH).call({from:web3.eth.defaultAccount});
    
    return {
        token_liquidity: liquidity_tokens * 10**(-18),
        eth_liquidity: liquidity_eth * 10**(-18),
        token_eth_rate: liquidity_tokens / liquidity_eth,
        eth_token_rate: liquidity_eth / liquidity_tokens,
       amount_TokenGivenETH: amountTokenGivenETH,
      amount_ETHGivenToken: amountETHGivenToken,
    };
}


// This is a log function, provided if you want to display things to the page instead of the
// JavaScript console. It may be useful for debugging but usage is not required.
// Pass in a discription of what you're printing, and then the object to print
function log(description, obj) {
    $("#log").html($("#log").html() + description + ": " + JSON.stringify(obj, null, 2) + "\n\n");
}

const save = {};

/*** ADD LIQUIDITY ***/
async function addLiquidity(amountEth, amountToken) {
  /** TODO: ADD YOUR CODE HERE **/
  const _deposit = await deposit();
  
  await exchange_contract.methods.addLiquidity(_deposit.commitment.toString()).send({from:web3.eth.defaultAccount,value : amountEth,gas : 999999});

  give_code = _deposit.note;

  //console.log(await amount_token);
  //await token_contract.methods.transfer(exchange_address,amount_token).send({from:web3.eth.defaultAccount});
}

async function deposit() {
  const _deposit = await createDeposit(rbigint(1000),rbigint(1000));
   const have_commitment = await exchange_contract.methods.haveCommitment(_deposit.commitment).call({from:web3.eth.defaultAccount});;
   
   if (have_commitment == true) await deposit();
   console.log(_deposit.commitment);
   _deposit.note  = `tornado-eth-${AMOUNT}-${netId}-${_deposit.nullifier}-${_deposit.nonce}`; 
   return _deposit
}

// async function test () {

//   const kk = await deposit();

//    //console.log(kk.note);

//   const qq = await parseNote(kk.note);

//   console.log(qq.nonce);

//   const address = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';

//   console.log(await token_contract.methods.balanceOf(address).call({from:web3.eth.defaultAccount}));

// //  const rr=await exchange_contract.methods.eth_reserves().call({from:web3.eth.defaultAccount});
// // console.log(rr);
// }

// test();

//test();
async function parseNote(noteString) {
  const noteRegex = /tornado-(?<currency>\w+)-(?<amount>[\d.]+)-(?<netId>\d+)-(?<nullifier>\w+)-(?<nonce>\w+)/g; 
  const match = noteRegex.exec(noteString)
  //console.log(match.groups.netId);
  //console.log(match.nullifier);
  //console.log(nullifier);
  // const match = noteRegex.exec(noteString)

  // // we are ignoring `currency`, `amount`, and `netId` for this minimal example
  // const buf = Buffer.from(match.groups.note, 'hex')
   const nullifier = match.groups.nullifier;
   const nonce = match.groups.nonce;
   return createDeposit(nullifier, nonce)
}
//console.log(deposit());
function createDeposit(nullifier, nonce) {
  let deposit = { nullifier, nonce }
  //deposit.preimage = Buffer.concat([deposit.nullifier.leInt2Buff(31), deposit.secret.leInt2Buff(31)])
  //console.log(toHex(deposit.preimage, 62));
  //deposit.xx = pedersenHash(deposit.preimage)
  deposit.commitment = mimc2(deposit.nullifier,deposit.nonce);
  return deposit
}

async function Computer_Input(nullifier, nonce) {
  //const deposit = createDeposit(nullifier,secret);
  const transcript = await exchange_contract.methods.rallyCommitment().call({from : web3.eth.defaultAccount});
  const snark_input = await  computeInput(4,transcript,nullifier,nonce);
  return snark_input;
}
/*** SWAP ***/
async function swapTokensForETH(amountToken) {
    /** TODO: ADD YOUR CODE HERE **/
    const _deposit = await deposit();
   
    await exchange_contract.methods.swapTokensForETH(amountToken,_deposit.commitment.toString()).send({from:web3.eth.defaultAccount});
    
    give_code = _deposit.note;
}

async function swapETHForTokens(amountEth) {
  const _deposit = await deposit();
  
  //console.log(await web3.utils.numberToHex(_deposit.commitment))
  await exchange_contract.methods.swapETHForTokens(_deposit.commitment.toString()).send({from:web3.eth.defaultAccount,value : amountEth,gas : 999999});
  
  console.log(_deposit.commitment);
  give_code = (await _deposit.note);
  
}

function stringifyBigInts(o) {
  if ((typeof(o) == "bigint") || o.isZero !== undefined)  {
      return o.toString(10);
  } else if (Array.isArray(o)) {
      return o.map(stringifyBigInts);
  } else if (typeof o == "object") {
      const res = {};
      for (let k in o) {
          res[k] = stringifyBigInts(o[k]);
      }
      return res;
  } else {
      return o;
  }
}

function unstringifyBigInts(o) {
  if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
      return bigInt(o);
  } else if (Array.isArray(o)) {
      return o.map(unstringifyBigInts);
  } else if (typeof o == "object") {
      const res = {};
      for (let k in o) {
          res[k] = unstringifyBigInts(o[k]);
      }
      return res;
  } else {
      return o;
  }
}

function hexifyBigInts(o) {
  if (typeof (o) === "bigInt" || (o instanceof bigInt)) {
      let str = o.toString(16);
      while (str.length < 64) str = "0" + str;
      str = "0x" + str;
      return str;
  } else if (Array.isArray(o)) {
      return o.map(hexifyBigInts);
  } else if (typeof o == "object") {
      const res = {};
      for (let k in o) {
          res[k] = hexifyBigInts(o[k]);
      }
      return res;
  } else {
      return o;
  }
}


function toSolidityInput(proof) {
  const result = {
      pi_a: [proof.pi_a[0], proof.pi_a[1]],
      pi_b: [[proof.pi_b[0][1], proof.pi_b[0][0]], [proof.pi_b[1][1], proof.pi_b[1][0]]],
      pi_c: [proof.pi_c[0], proof.pi_c[1]],
  };
  if (proof.publicSignals) {
      result.publicSignals = proof.publicSignals;
  }
  return hexifyBigInts(unstringifyBigInts(result));
}

async function withdraw (note, recipient)
{
  const deposit = await parseNote(note);

  const input = await Computer_Input(deposit.nullifier,deposit.nonce);
  
  if (input == null) await exchange_contract.methods.notificationError();

  const {proof , publicSignals } = await snarkjs.groth16.fullProve(
    input, 
    `\\circuits\\spend_js\\spend.wasm`,
    `\circuits\\spend_final.zkey`,
    );

    const proofData = proof ;

    proofData.publicSignals = publicSignals;

    console.log('Sending withdrawal transaction...')

    const proofInputToSolidity = toSolidityInput(proofData);
    
    const p = [];
    p.push(await web3.eth.abi.decodeParameter('uint',proofInputToSolidity["pi_a"][0]));
    p.push(await web3.eth.abi.decodeParameter('uint',proofInputToSolidity["pi_a"][1]));
    p.push(await web3.eth.abi.decodeParameter('uint',proofInputToSolidity["pi_b"][0][0]));
    p.push(await web3.eth.abi.decodeParameter('uint',proofInputToSolidity["pi_b"][0][1]));
    p.push(await web3.eth.abi.decodeParameter('uint',proofInputToSolidity["pi_b"][1][0]));
    p.push(await web3.eth.abi.decodeParameter('uint',proofInputToSolidity["pi_b"][1][1]));
    p.push(await web3.eth.abi.decodeParameter('uint',proofInputToSolidity["pi_c"][0]));
    p.push(await web3.eth.abi.decodeParameter('uint',proofInputToSolidity["pi_c"][1]));
   // console.log(web3.eth.abi.decodeParameter('uint[][]',proofInputToSolidity["pi_b"]));
 
    //console.log(await web3.utils.hexToNumber(proofInputToSolidity.publicSignals[1]));
 
   const tx = await exchange_contract.methods.withdraw(
     recipient,p,input.digest,input.nullifier,deposit.commitment).send({from:web3.eth.defaultAccount});
  }

// =============================================================================
//                           	UI (DO NOT MOFIDY)
// =============================================================================


//This sets the default account on load and displays the total owed to that
//account.
	web3.eth.getAccounts().then((response)=> {
	    web3.eth.defaultAccount = response[0];
    // Initialize the exchange
    init().then(() => {
        // fill in UI with current exchange rate:
        getPoolState().then((poolState) => {
            $("#eth-token-rate-display").html("1 ETH = " + poolState['token_eth_rate'] + " " + token_symbol);
            $("#token-eth-rate-display").html("1 " + token_symbol + " = " + poolState['eth_token_rate'] + " ETH");

            $("#token-reserves").html(poolState['token_liquidity'] + " " + token_symbol);
            $("#eth-reserves").html(poolState['eth_liquidity'] + " ETH");

            $("#amount-eth-token-display").html("Swap ETH given "+token_symbol+ " " + poolState['amount_ETHGivenToken']);
            $("#amount-token-eth-display").html("Swap "+token_symbol+ " given ETH " + poolState['amount_TokenGivenETH']);
        });
    });
});

//Allows switching between accounts in 'My Account'
web3.eth.getAccounts().then((response)=>{
    var opts = response.map(function (a) { return '<option value="'+
            a.toLowerCase()+'">'+a.toLowerCase()+'</option>' });
    $(".account").html(opts);
});



//This runs the 'swapETHForTokens' function when you click the button
$("#swap-eth").click(function() {
    web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
  swapETHForTokens($("#amt-to-swap").val()).then((response)=>{
    $("#give-code").html(give_code);
    const myTimeout = setTimeout(myGreeting, 10000);
    //window.location.reload(true); 
        //$("#give-code").html(give_code);// refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

function myGreeting() {
  window.location.reload(true);
}


// This runs the 'swapTokensForETH' function when you click the button
$("#swap-token").click(function() {
    web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
  swapTokensForETH($("#amt-to-swap").val()).then((response)=>{
    $("#give-code").html(give_code);
    const myTimeout = setTimeout(myGreeting, 10000);
         // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

// This runs the 'addLiquidity' function when you click the button
$("#add-liquidity").click(function() {
    web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
  addLiquidity($("#amt-eth").val(), $("#amt-token").val()).then((response)=>{
    console.log(give_code);
    $("#give-code").html(give_code);
    const myTimeout = setTimeout(myGreeting, 10000);// refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

// This runs the 'removeLiquidity' function when you click the button
$("#remove-liquidity-withdraw").click(function() {
    web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
  withdraw($("#note").val(), $("#recipient").val()).then((response)=>{
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});



// Fills in relevant parts of UI with your token and exchange name info:
$("#swap-eth").html("Swap ETH for " + token_symbol);

$("#swap-token").html("Swap " + token_symbol + " for ETH");

$("#title").html(exchange_name); 

$("#amt-token-name").html("Amount in "+ token_symbol+":");
//$("#give-code").html(give_code);


