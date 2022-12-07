const {ethers} = require("hardhat");
const { expect } = require("chai");
const path = require("path");
const common = require("mocha/lib/interfaces/common");
describe("test", () => {
    it("abc", async() => {
         const [deployer] = await ethers.getSigners();
         const tokenFactory = await ethers.getContractFactory("SpendVerifier");
         const token = await tokenFactory.deploy();

         const tokenFactory1 = await ethers.getContractFactory("Token");
         const token1 = await tokenFactory1.deploy("Khang","KHA");
         const tokenFactory2 = await ethers.getContractFactory("TokenExchange");
         const token2 = await tokenFactory2.deploy();

         console.log(token.address);

         console.log(token1.address);
        
        // console.log(token.address);

        // console.log(token1.address);

        // console.log(token2.address);

        // const bb = await token2.k();
        // console.log(bb);
        // const aa = await token2.amountTokenGivenETH(100);
        // await token2.amountETHGivenToken(100);
        // console.log(bb);
        // await token1._mint(1000000);
        // console.log(await token1.balanceOf(deployer.address));
        // await token1.approve(token2.address,1000000);
        // await token2.createPool(1000000,{value : 1000000});
        // console.log(await token2.eth_reserves());
        // console.log(await token2.token_reserves());
        // const cc = await token2.amountTokenGivenETH(100);
        // console.log(await token1.balanceOf(deployer.address));
        // const commitment = '0x626c756500000000000000000000000000000000000000000000000000000000';
        // // const dd= await token2.swapTokensForETH(commitment);
        // // console.log(await token1.TranferDone(deployer.address,token2.address));
        // // const kk= await token2.amountETHGivenToken(100);
        // // console.log(kk);
        // // //console.log(await 
        // // const hh = await token2.swapETHForTokens(commitment,{value :100});
        // // console.log(await token2.token_reserves());
        // // const as= await token2.swapTokensForETH(commitment);
        //  const strin = "6342589195124353433434154579877662112908465778696632921422435640639249461087";
        // console.log(await token2.StringToUint(strin));
        // const proofInputToSolidity = {
        // "pi_a":["0x060f5817dfc3896475781d801a038a78f5cbe631509c0ad561c5e890141300ac","0x00079e6bc41e5f403f17643896e6f875aa32b93b38a9dfb30fd8ffb747342b98"],
        // "pi_b":[["0x0acc7650b11821a34fc7851884c0ea0ee350136a9ed9d6c60d70caa57da5a2c5","0x242a9899a4f1f568bf26c51100d93ad6c52b518748b916ca1ea3956d7c2adc3a"],["0x20f3f19374c52007e287b1f84d38d5f5bc7e302c6a66d5d7389610817ae3eb2a","0x03bb091c17769c58ce286edb80e8b357dc38e045bb347a0ee1efcff92907c2e3"]],
        // "pi_c":["0x096636d212dbf38cdcf86437542c9fbe8ceb1871f85a1cff944d2f9ec46387cc","0x29b80bc5eb3a719cff1768938f86aadc6e20c2ec93d06f929632ff90938faace"]}
        // const tokenFactory3 = await ethers.getContractFactory("aa");
        // const token3 = await tokenFactory3.deploy();
        // //const proofInputToSolidity = ['0x2be6573173508481f8cd889beb0e94dd5134ee2fead975bb5a32aca4bac0256a', '0x00000000000000000000000000000000000000000000000000000000000002d9']

        // const pi_b = await web3.eth.abi.encodeParameter('bytes32[][]',proofInputToSolidity["pi_b"]);

       // const proof = 
     //  const gg= await token3.uas(pi_b);
        //console.log(gg);
       
            
        const digest = "621721547200454116127789998551669795950409776838817738855928523660041060085";
        const nullifier = "441";

            const pr = '0x000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000000020e84757b3497e011eaa8ddf22ee0a9636514a8a423ff9cd60ab4215d28f49b4704b1e5676c8a528725864e7668ecc39331ba2de7979c16b6b6e236680cae722c0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000020e31e225c68319620797177543995e463a374e108324c06cc72eb639de1d4e6f0c57cbf2d8516106357718fc0335eda6cea24a44a12ddafd373f34a8718b8d9d000000000000000000000000000000000000000000000000000000000000000211a9c1fd03ca29ddc66be0af06d19c1a14447abfe2378ce567317cbd062bcad70a10adbe333257373d785969ca6c018397ffe0f6dd9dd39e0cb3b7513990085500000000000000000000000000000000000000000000000000000000000000020684701a82d3099ddc505854559657b47d9917b780d128cbba1e6e11f5dc2d61089498916910a9822e6ad755654bb8aac9713a286181f344227e751ffce9c394';
            const tt = await web3.eth.abi.decodeParameters(['uint[]','uint[][]','uint'],pr);
            console.log(token2.address);
           const p =['7782675597570461573127795431419578613375221773043879614691739357091381963648', '7996651202428608794756255015768100680822862946397029172247529729202370849997', '12486352318239295082522424532865846461639871935855114722419006476215862066310', '14830578944808774055512602331175807868677443084793124867879896468492781639938', '19802639576491842483351141430383734228307331264660322741729262114879243529990', '7435320361929956582739935843708500256134163559320228806979282634910164345424', '3547117796120212574577937952627185624639366473542982208330404311691949797938', '7483516678127181043707934126728561734229297358551172683744415720503220522849'];
           const ff = await token2.withdraw(deployer.address,p,digest,nullifier,"Ass");
            
            console.log(ff);
        

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