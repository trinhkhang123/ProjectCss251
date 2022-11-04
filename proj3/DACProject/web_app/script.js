// =============================================================================
//                                  Config
// =============================================================================
//import { expect } from ("chai.js");
//const { ethers } = require("hardhat");
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
//const abiDecoder = require('abi-decoder');
//var jsdom = require("jsdom");
//$ = require("jquery")(new jsdom.JSDOM().window);

//import { abiDecoder } from './abi-decoder.js';
var defaultAccount;

// Constant we use later
var GENESIS = '0x0000000000000000000000000000000000000000000000000000000000000000';

// This is the ABI for your contract (get it from Remix, in the 'Compile' tab)
// ============================================================
var abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "creditor",
          "type": "address"
        },
        {
          "internalType": "uint32",
          "name": "amount",
          "type": "uint32"
        }
      ],
      "name": "addIOU",
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
          "name": "userOwe",
          "type": "address"
        }
      ],
      "name": "getTotalOwed",
      "outputs": [
        {
          "internalType": "uint32",
          "name": "",
          "type": "uint32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getUser",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "debtor",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "creditor",
          "type": "address"
        }
      ],
      "name": "lookup",
      "outputs": [
        {
          "internalType": "uint32",
          "name": "",
          "type": "uint32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "node",
          "type": "address"
        }
      ],
      "name": "numberNode",
      "outputs": [
        {
          "internalType": "uint32",
          "name": "",
          "type": "uint32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "a",
          "type": "address"
        }
      ],
      "name": "ownerr",
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
      "inputs": [
        {
          "internalType": "address",
          "name": "debtor",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "creditor",
          "type": "address"
        },
        {
          "internalType": "uint32",
          "name": "amount",
          "type": "uint32"
        }
      ],
      "name": "subIOU",
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
  ] ; // FIXME: fill this in with your contract's ABI 
  //Be sure to only have one array, not two
// ============================================================
abiDecoder.addABI(abi);
// call abiDecoder.decodeMethod to use this - see 'getAllFunctionCalls' for more

var contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // FIXME: fill this in with your contract's address/hash

var BlockchainSplitwise = new ethers.Contract(contractAddress, abi, provider.getSigner());
// =============================================================================
//                            Functions To Implement
// =============================================================================

// TODO: Add any helper functions here!

// TODO: Return a list of all users (creditors or debtors) in the system
// All users in the system are everyone who has ever sent or received an IOU
async function getUsers() {
	var user = await BlockchainSplitwise.getUser();
	return user;
}

// TODO: Get the total amount owed by the user specified by 'user'
async function getTotalOwed(user) {
	var total = await BlockchainSplitwise.getTotalOwed(user);
	return total;
}

// TODO: Get the last time this user has sent or received an IOU, in seconds since Jan. 1, 1970
// Return null if you can't find any activity for the user.
// HINT: Try looking at the way 'getAllFunctionCalls' is written. You can modify it if you'd like.
async function getLastActive(user) {
	var curBlock = await provider.getBlockNumber();// Returns the current block number.
	var function_calls = [];

	while (curBlock !== GENESIS) {
	  var currentBlock = await provider.getBlockWithTransactions(curBlock);
	  var txns = currentBlock.transactions;

	  for (var j = 0 ; j <txns.length ; j++) {
	  	var txn = txns[j];
			if(txn.to == null){continue;}
	  	if (txn.from.toLowerCase() === user.toLowerCase()) {
	  		var timeBlock = await provider.getBlock(curBlock);
	  		return ({t :timeBlock.timestamp});
	  		}
	  	}
		curBlock = currentBlock.parentHash;
	}
	
	return null;
}

// TODO: add an IOU ('I owe you') to the system
// The person you owe money is passed as 'creditor'
// The amount you owe them is passed as 'amount'
async function add_IOU(creditor, amount) {
	var debtor  = defaultAccount;	
	var users = await getUsers();
	//const signers = await ethers.getSigners();
	var over1 = await BlockchainSplitwise.connect(await provider.getSigner(debtor)).addIOU(creditor, amount);

	async function getNeighbors(node) {
		var graph = new Array();
		for (var i =0;i<users.length; i++)
			if (await BlockchainSplitwise.lookup(users[node],users[i]) > 0)
				graph.push(i);
		return graph;
	}
	
	async function doBFS(start, end, getNeighbors) {
		var queue = [[await BlockchainSplitwise.numberNode(start)]];
		while (queue.length > 0) {
			var cur = queue.shift();
			var lastNode = cur[cur.length-1];
			if (lastNode === await BlockchainSplitwise.numberNode(end)) {
				return cur;
			} else {
				var neighbors = new Array();
				neighbors = await getNeighbors(lastNode);
				for (var i = 0; i < neighbors.length; i++) {
					queue.push(cur.concat([neighbors[i]]));
				}
			}
		}
		return null;
	}``

	//console.log(await users.length);

	for (var i=0; i<users.length; i++)
	 {
		while (await BlockchainSplitwise.lookup(users[i],debtor) > 0 && 
		await doBFS(debtor,users[i],getNeighbors) != null)
		{
		 //   console.log(await doBFS(debtor,users[i],getNeighbors));
			
			var trace = await doBFS(debtor,users[i],getNeighbors);
			//console.log(trace.length);
			//console.log(users[trace[2]],users[trace[0]]),await Deploy.lookup(users[trace[2]],users[trace[0]]);
			var minValue = Number.MAX_VALUE;
			for (var i = 0; i<trace.length; i++) {
				var value = 0;
				if (i < trace.length - 1) {
					value = await BlockchainSplitwise.lookup(users[trace[i]],users[trace[i+1]]);
				}
				else value = await BlockchainSplitwise.lookup(users[trace[i]],users[trace[0]]);
				minValue = Math.min (minValue, value);
			}

			for (var i = 0; i<trace.length-1; i++) {
				var over2 = await BlockchainSplitwise.connect(await provider.getSigner("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266")).subIOU(users[trace[i]],users[trace[i+1]],minValue);
			}
			var over3 = await BlockchainSplitwise.connect(await provider.getSigner("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266")).subIOU(users[trace[trace.length-1]],users[trace[0]],minValue);
		}
	}


	
}

// =============================================================================
//                              Provided Functions
// =============================================================================
// Reading and understanding these should help you implement the above

// This searches the block history for all calls to 'functionName' (string) on the 'addressOfContract' (string) contract
// It returns an array of objects, one for  containing the sender ('from'), arguments ('args'), and the timestamp ('t')
async function getAllFunctionCalls(addressOfContract, functionName) {
	var curBlock = await provider.getBlockNumber();// Returns the current block number.
	var function_calls = [];

	while (curBlock !== GENESIS) {
	  var b = await provider.getBlockWithTransactions(curBlock);
	  var txns = b.transactions;
	  for (var j = 0; j < txns.length; j++) {
	  	var txn = txns[j];

	  	// check that destination of txn is our contract
			if(txn.to == null){continue;}
	  	if (txn.to.toLowerCase() === addressOfContract.toLowerCase()) {
	  		var func_call = abiDecoder.decodeMethod(txn.data);

				// check that the function getting called in this txn is 'functionName'
				if (func_call && func_call.name === functionName) {
					var timeBlock = await provider.getBlock(curBlock);
		  		var args = func_call.params.map(function (x) {return x.value});
	  			function_calls.push({
	  				from: txn.from.toLowerCase(),
	  				args: args,
						t: timeBlock.timestamp
	  			})
	  		}
	  	}
	  }
	  curBlock = b.parentHash;
	}
	return function_calls;
}

// We've provided a breadth-first search implementation for you, if that's useful
// It will find a path from start to end (or return null if none exists)
// You just need to pass in a function ('getNeighbors') that takes a node (string) and returns its neighbors (as an array)
async function getNeighbors(node) {
	var graph = await BlockchainSplitwise.findCycle();
	return graph[node];
}

async function doBFS(start, end, getNeighbors) {
	var queue = [[start]];
	while (queue.length > 0) {
		var cur = queue.shift();
		var lastNode = cur[cur.length-1]
		if (lastNode.toLowerCase() === end.toString().toLowerCase()) {
			return cur;
		} else {
			var neighbors = await getNeighbors(lastNode);
			for (var i = 0; i < neighbors.length; i++) {
				queue.push(cur.concat([neighbors[i]]));
			}
		}
	}
	return null;
}
// =============================================================================
//                                      UI
// =============================================================================

// This sets the default account on load and displays the total owed to that
// account.
provider.listAccounts().then((response)=> {
	defaultAccount = response[0];

	getTotalOwed(defaultAccount).then((response)=>{
		$("#total_owed").html("$"+response);
	});

	getLastActive(defaultAccount).then((response)=>{
		time = new Date(response)
		$("#last_active").html(time)
	});
});

// This code updates the 'My Account' UI with the results of your functions
$("#myaccount").change(function() {
	defaultAccount = $(this).val();

	getTotalOwed(defaultAccount).then((response)=>{
		$("#total_owed").html("$"+response);
	})

	getLastActive(defaultAccount).then((response)=>{
		time = timeConverter(response)
		$("#last_active").html(time)
	});
});

// Allows switching between accounts in 'My Account' and the 'fast-copy' in 'Address of person you owe
provider.listAccounts().then((response)=>{
	var opts = response.map(function (a) { return '<option value="'+
			a.toLowerCase()+'">'+a.toLowerCase()+'</option>' });
	$(".account").html(opts);
	$(".wallet_addresses").html(response.map(function (a) { return '<li>'+a.toLowerCase()+'</li>' }));
});

// This code updates the 'Users' list in the UI with the results of your function
getUsers().then((response)=>{
	$("#all_users").html(response.map(function (u,i) { return "<li>"+u+"</li>" }));
});

// This runs the 'add_IOU' function when you click the button
// It passes the values from the two inputs above
$("#addiou").click(function() {
	defaultAccount = $("#myaccount").val(); //sets the default account
  add_IOU($("#creditor").val(), $("#amount").val()).then((response)=>{
		window.location.reload(false); // refreshes the page after add_IOU returns and the promise is unwrapped
	})
});

// This is a log function, provided if you want to display things to the page instead of the JavaScript console
// Pass in a discription of what you're printing, and then the object to print
function log(description, obj) {
	$("#log").html($("#log").html() + description + ": " + JSON.stringify(obj, null, 2) + "\n\n");
}

// =============================================================================
//                                      TESTING
// =============================================================================

// This section contains a sanity check test that you can use to ensure your code
// works. We will be testing your code this way, so make sure you at least pass
// the given test. You are encouraged to write more tests!

// Remember: the tests will assume that each of the four client functions are
// async functions and thus will return a promise. Make sure you understand what this means.

function check(name, condition) {
	if (condition) {
		console.log(name + ": SUCCESS");
		return 3;
	} else {
		console.log(name + ": FAILED");
		return 0;
	}
}
/*
async function sanityCheck() {
	const signers = await ethers.getSigners();
	const signer = signers[0];
	console.log ("\nTEST", "Simplest possible test: only runs one add_IOU; uses all client functions: lookup, getTotalOwed, getUsers, getLastActive");

	var score = 0;

	var accounts = await provider.listAccounts();

	var users = await getUsers();

	defaultAccount = accounts[0];

	var lookup_0_1 = await BlockchainSplitwise.lookup(accounts[0], accounts[1]);
	
	score += check("getUsers() initially empty", users.length === 0);

	var owed = await getTotalOwed(accounts[1]);
	score += check("getTotalOwed(0) initially empty", owed === 0);

	var lookup_0_1 = await BlockchainSplitwise.lookup(accounts[0], accounts[1]);
	console.log("lookup(0, 1) current value" + lookup_0_1);
	score += check("lookup(0,1) initially 0", parseInt(lookup_0_1, 10) === 0);

	var response = await add_IOU(signer,accounts[1], "10");

	users = await getUsers();
	score += check("getUsers() now length 2", users.length === 2);

	owed = await getTotalOwed(accounts[0]);
	score += check("getTotalOwed(0) now 10", owed === 10);

	lookup_0_1 = await BlockchainSplitwise.lookup(accounts[0], accounts[1]);
	score += check("lookup(0,1) now 10", parseInt(lookup_0_1, 10) === 10);
	console.log();
	console.log("lookup(0,1) after the 1st trade",await BlockchainSplitwise.lookup(accounts[0],accounts[1]));
	console.log("lookup(1,2) after the 1st trade",await BlockchainSplitwise.lookup(accounts[1],accounts[2]));
	console.log("lookup(2,0) after the 1st trade",await BlockchainSplitwise.lookup(accounts[2],accounts[0]));
	console.log();
	var timeLastActive = await getLastActive(accounts[0]);
	var timeNow = Date.now()/1000;
	var difference = timeNow - timeLastActive.t;
	score += check("getLastActive(0) works", difference <= 60 && difference >= -3); // -3 to 60 seconds
	//console.log(difference);
	console.log("Final Score: " + score +"/21");
	console.log();
	var response = await add_IOU(signers[1],accounts[2], "10");
	console.log("lookup(0,1) after the 2st trade",await BlockchainSplitwise.lookup(accounts[0],accounts[1]));
	console.log("lookup(1,2) after the 2st trade",await BlockchainSplitwise.lookup(accounts[1],accounts[2]));
	console.log("lookup(2,0) after the 2st trade",await BlockchainSplitwise.lookup(accounts[2],accounts[0]));
	
	var response = await add_IOU(signers[2],accounts[0], "10");
	console.log();
	console.log("lookup(0,1) after the 3st trade",await BlockchainSplitwise.lookup(accounts[0],accounts[1]));
	console.log("lookup(1,2) after the 3st trade",await BlockchainSplitwise.lookup(accounts[1],accounts[2]));
	console.log("lookup(2,0) after the 3st trade",await BlockchainSplitwise.lookup(accounts[2],accounts[0]));
}
sanityCheck();*/
//Uncomment this line to run the sanity check when you first open index.html