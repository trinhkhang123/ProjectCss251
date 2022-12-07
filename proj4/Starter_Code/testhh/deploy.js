const {ethers} = require("hardhat");
const { expect } = require("chai");
const path = require("path");
describe("test", () => {
    it("abc", async() => {
        const [deployer] = await ethers.getSigners();
        const tokenFactory = await ethers.getContractFactory("SpendVerifier");
        const token = await tokenFactory.deploy();

        const tokenFactory1 = await ethers.getContractFactory("Token");
        const token1 = await tokenFactory1.deploy("Khang","KHA");
        const tokenFactory2 = await ethers.getContractFactory("Token");
        const token2 = await tokenFactory2.deploy();
        

        // const exchangeFactory = await ethers.getContractFactory("TokenExchange");
        // const exchange =await  exchangeFactory.deploy();
        // console.log(await exchange.address);

        // var amount = 100000000;
        // await token.connect(deployer)._mint(amount);
        // console.log(await token.balanceOf(deployer.address));
        // await token.approve(exchange.address,amount);
        // await exchange.createPool(amount,{value: amount});
        // console.log(await exchange.eth_reserves());
        // await exchange.swapETHForTokens(100,1,{value:100});
        
        // console.log(await token.balanceOf(deployer.address));
        // console.log(await exchange.token_reserves()* await exchange.eth_reserves() );
        // await exchange.swapETHForTokens(100,1,{value:100});
        // console.log(await exchange.eth_reserves());
        // console.log(await exchange.token_reserves());
        // console.log(await token.balanceOf(deployer.address));
        // console.log(await exchange.k());
        // console.log(await exchange.token_reserves()* await exchange.eth_reserves() );
        // await exchange.addLiquidity(100,0,{value : 100});
        // console.log(await token.aa());
        // await token._disable_mint();
        // await token.transfer(exchange.address,100);
        // console.log(await token.aa());
        //await exchange.createPool(1000,{value:1000});
        //await exchange.addLiquidity();
    });
});