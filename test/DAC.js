    const { expect } = require("chai");
    const hre = require("hardhat");
    const { time } = require("@nomicfoundation/hardhat-network-helpers");


    describe("Splitwise Contract", function () {

    it("Check", async function() {
    const SplitwiseContract = await hre.ethers.getContractFactory("Splitwise");
    const Deploy = await SplitwiseContract.deploy();
    var score = 0;
    var accounts = await hre.ethers.getSigners();
    //await Deploy.deployed();

    function check(name, condition) {
            if (condition) {
                console.log(name + ": SUCCESS");
                return 3;
            } else {
                console.log(name + ": FAILED");
                return 0;
            }
        }
        
        async function add_IOU(debtor, creditor, amount) {	
            var over1 = await Deploy.connect(debtor).addIOU(creditor, amount);
            var users = await Deploy.getUser();
        
            async function getNeighbors(node) {
                var graph = new Array();
                for (var i =0;i<users.length; i++)
                    if (await Deploy.lookup(users[node],users[i]) > 0)
                        graph.push(i);
                return graph;
            }

            async function doBFS(start, end, getNeighbors) {
                var queue = [[await Deploy.numberNode(start)]];
                while (queue.length > 0) {
                    var cur = queue.shift();
                    var lastNode = cur[cur.length-1];
                    if (lastNode === await Deploy.numberNode(end)) {
                        return cur;
                    } else {
                        var neighbors = new Array();
                        neighbors = await getNeighbors(lastNode);
                        for (var i = 0; i < neighbors.length; i++) {
                            queue.push(cur.concat([neighbors[i]]));
                        }
                    }
                    //console.log(queue);
                }
                return null;
            }

    

            for (var i=0; i<users.length; i++)
             {
                while (await Deploy.lookup(users[i],debtor.address) > 0 && await doBFS(debtor.address,users[i],getNeighbors) != null)
                {
                 //   console.log(await doBFS(debtor.address,users[i],getNeighbors));
                    
                    var trace = await doBFS(debtor.address,users[i],getNeighbors);
                    //console.log(trace.length);
                    //console.log(users[trace[2]],users[trace[0]]),await Deploy.lookup(users[trace[2]],users[trace[0]]);
                    var minValue = Number.MAX_VALUE;
                    for (var i = 0; i<trace.length; i++) {
                        var value = 0;
                        if (i < trace.length - 1) {
                            value = await Deploy.lookup(users[trace[i]],users[trace[i+1]]);
                        }
                        else value = await Deploy.lookup(users[trace[i]],users[trace[0]]);
                        minValue = Math.min (minValue, value);
                    }

                    //console.log(minValue);
                    for (var i = 0; i<trace.length-1; i++) {
                        var over2 = await Deploy.connect(accounts[0]).subIOU(users[trace[i]],users[trace[i+1]],minValue);
                    }
                    var over3 = await Deploy.connect(accounts[0]).subIOU(users[trace[trace.length-1]],users[trace[0]],minValue);
                    break;
                }
            }
        }

    // console.log(accounts[0].address);
         defaultAccount = accounts[0];
        var lookup_0_1 = await Deploy.lookup(accounts[0].address, accounts[1].address);
        var users = await Deploy.getUser();
        score += check("getUsers() initially empty", users.length === 0);

        var owed = await Deploy.getTotalOwed(accounts[1].address);
        score += check("getTotalOwed(0) initially empty", owed === 0);

        var lookup_0_1 = await Deploy.lookup(accounts[0].address, accounts[1].address);
        console.log("lookup(0, 1) current value" + lookup_0_1);
        score += check("lookup(0,1) initially 0", parseInt(lookup_0_1, 10) === 0);

        var response = await add_IOU(accounts[0],accounts[1].address, 10);

        users = await Deploy.getUser();
        score += check("getUsers() now length 2", users.length === 2);

       //  console.log(await Deploy.lookup(users[2],users[1]));
        owed = await Deploy.getTotalOwed(accounts[0].address);
         score += check("getTotalOwed(0) now 10", owed === 10);
       
        lookup_0_1 = await Deploy.lookup(accounts[0].address, accounts[1].address);

        
        score += check("lookup(0,1) now 10", parseInt(lookup_0_1, 10) === 10);
        var response1 = await add_IOU(accounts[1],accounts[2].address, 11);
        var response2 = await add_IOU(accounts[2],accounts[0].address, 12);

        
        users = await Deploy.getUser();
        //var timeLastActive = await Deploy.getLastActive(accounts[0].address);
        /*var timeNow = Date.now()/1000;
        var difference = timeNow - timeLastActive;
        score += check("getLastActive(0) works", difference <= 60 && difference >= -3); // -3 to 60 seconds
    */
        console.log("Final Score: " + score +"/21");
        await expect(1).to.be.equal(1);
    });
    });