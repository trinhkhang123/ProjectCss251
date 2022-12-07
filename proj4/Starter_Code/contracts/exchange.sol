// =================== CS251 DEX Project =================== // 
//        @authors: Simon Tao '22, Mathew Hogan '22          //
// ========================================================= //    
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "../interfaces/IERC20.sol";
import './token.sol';
import '../libraries/ownable.sol';
import '../libraries/safemath.sol';
/* This exchange is based off of Uniswap V1. The original whitepaper for the constant product rule
 * can be found here:
 * https://github.com/runtimeverification/verified-smart-contracts/blob/uniswap/uniswap/x-y-k.pdf
 */

interface IVerifier {
  function verifyProof(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[2] memory input
        ) external returns (bool r) ;
}


contract TokenExchange is Ownable {
    using SafeMath for uint256;
    address public admin;
    IVerifier public immutable verifier;

    address tokenAddr = 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512;                              // TODO: Paste token contract address here.
    Token private token = Token(tokenAddr);         // TODO: Replace "Token" with your token class.             
    mapping (address => uint) provider_eth;
    mapping (address => uint) provider_token;
    mapping (string => uint) commitments;
    mapping (string => bool) nullifierHashes;
    mapping (address => mapping(address => uint)) tranfer_done;
    string[] public rally_commitments;
    uint index;
    uint amount_eth_permanent;
    uint amount_token_permanent;
    // Liquidity pool for the exchange
    uint public token_reserves = 0;
    uint public eth_reserves = 0;

    // Constant: x * y = k
    uint public k;
    
    // liquidity rewards
    uint public swap_fee_numerator = 5;       // TODO Part 5: Set liquidity providers' returns.
    uint public swap_fee_denominator = 100;
    
    event AddLiquidity(address from, uint amountToken,uint amountETH);

    constructor() 
    {
        admin = msg.sender;
        amount_eth_permanent = 100;
        amount_token_permanent = 100;
        verifier = IVerifier(0x5FbDB2315678afecb367f032d93F642f64180aa3);
    }

    /**
     * Initializes a liquidity pool between your token and ETH.
     * 
     * This is a payable function which means you can send in ETH as a quasi-parameter. In this
     * case, the amount of eth sent to the pool will be in msg.value and the number of tokens will
     * be amountTokens.
     *
     * Requirements:
     *  - the liquidity pool should be empty to start
     *  - the sender should send positive values for each
     */

    
    function createPool(uint amountTokens)
        external
        payable
        onlyOwner
    {
        // This function is already implemented for you; no changes needed

        // require pool does not yet exist
        require (token_reserves == 0, "Token reserves was not 0");
        require (eth_reserves == 0, "ETH reserves was not 0.");

        // require nonzero values were sent
        require (msg.value > 0, "Need ETH to create pool.");
        require (amountTokens > 0, "Need tokens to create pool.");

        token.transferFrom(msg.sender, address(this), amountTokens);
        eth_reserves = msg.value;
        token_reserves = amountTokens;
        provider_eth[msg.sender] = msg.value;
        provider_token[msg.sender] = amountTokens;
        tranfer_done[msg.sender][address(this)] += amountTokens;
        k = eth_reserves.mul(token_reserves);
    }

    function priceToken() public view returns (uint) {
        uint multiply = 100;
        return multiply.mul(token_reserves).div(eth_reserves);
    }

    function rallyCommitment() public view returns (string[] memory)
    {
        return rally_commitments;
    }


    function priceETH() public view returns(uint) {
        uint multiply = 100;
        return multiply.mul(eth_reserves).div(token_reserves);
    }


    // ============================================================
    //                    FUNCTIONS TO IMPLEMENT
    // ============================================================
    
    // Given an amount of tokens, calculates the corresponding amount of ETH 
    // based on the current exchange rate of the pool.
    //
    // NOTE: You can change the inputs, or the scope of your function, as needed.
    function amountTokenGivenETH(uint amountToken) 
        public 
        view
        returns (uint)
    {
        if (token_reserves <= amountToken) return 0;
        return (k.div(token_reserves - amountToken)).sub(eth_reserves);
        /******* TODO: Implement this function *******/
        /* HINTS:
            Calculate how much ETH is of equivalent worth based on the current exchange rate.
        */
    }

    // Given an amount of ETH, calculates the corresponding amount of tokens 
    // based on the current exchange rate of the pool.
    //
    // NOTE: You can change the inputs, or the scope of your function, as needed.
    function amountETHGivenToken(uint amountETH)
        public
        view
        returns (uint)
    {
        if (eth_reserves <= amountETH) return 0;
        return (k.div(eth_reserves - amountETH)).sub(token_reserves);
        /******* TODO: Implement this function *******/
        /* HINTS:
            Calculate how much of your token is of equivalent worth based on the current exchange rate.
        */
    }


    /* ========================= Liquidity Provider Functions =========================  */ 

    /**
     * Adds liquidity given a supply of ETH (sent to the contract as msg.value).
     *
     * Calculates the liquidity to be added based on what was sent in and the prices. If the
     * caller possesses insufficient tokens to equal the ETH sent, then the transaction must
     * fail. A successful transaction should update the state of the contract, including the
     * new constant product k, and then Emit an AddLiquidity event.
     *
     * NOTE: You can change the inputs, or the scope of your function, as needed.
     */
    function addLiquidity(string memory commitment) 
        external 
        payable
    {
        uint tranferAfter = token.TranferDone(msg.sender,address(this));

        uint amountToken = tranferAfter - tranfer_done[msg.sender][address(this)] ;

        uint amountETH = msg.value;

        if(amountToken != amount_token_permanent || amountETH != amount_eth_permanent) {
            payable(msg.sender).transfer(amountToken);
            token.transfer(msg.sender,amountETH);
            require (1<0, "Error AddLiquidity 1");

        }
        if ( (amountToken == amount_token_permanent) && (amountETH == amount_eth_permanent))
        {
            payable(msg.sender).transfer(amountToken);
            token.transfer(msg.sender,amountETH);
            require (1<0, "Error AddLiquidity 2");
        }
        else if (amountToken == amount_token_permanent) {
            token_reserves = token_reserves.add(amountToken); 

            k = token_reserves.mul(eth_reserves);
            
            tranfer_done[msg.sender][address(this)] += amountToken;

            commitments[commitment] = 2;

            index ++;
            rally_commitments.push(commitment);
        }
        else {

            commitments[commitment] = 1;

            index ++;
            rally_commitments.push(commitment);

            eth_reserves = eth_reserves.add(msg.value);

            k = token_reserves.mul(eth_reserves) ;
        }
        
        emit AddLiquidity(msg.sender, amountETH,amountToken);
        /******* TODO: Implement this function *******/
        /* HINTS:
            Calculate the liquidity to be added based on what was sent in and the prices.
            If the caller possesses insufficient tokens to equal the ETH sent, then transaction must fail.
            Update token_reserves, eth_reserves, and k.
            Emit AddLiquidity event.
        */
    }


    /**
     * Removes liquidity given the desired amount of ETH to remove.
     *
     * Calculates the amount of your tokens that should be also removed. If the caller is not
     * entitled to remove the desired amount of liquidity, the transaction should fail. A
     * successful transaction should update the state of the contract, including the new constant
     * product k, transfer the ETH and Token to the sender and then Emit an RemoveLiquidity event.
     *
     * NOTE: You can change the inputs, or the scope of your function, as needed.
     */

    /**
     * Removes all liquidity that the sender is entitled to withdraw.
     *
     * Calculate the maximum amount of liquidity that the sender is entitled to withdraw and then
     * calls removeLiquidity() to remove that amount of liquidity from the pool.
     *
     * NOTE: You can change the inputs, or the scope of your function, as needed.
     */

    /* ========================= Swap Functions =========================  */ 

    /**
     * Swaps amountTokens of Token in exchange for ETH.
     *
     * Calculates the amount of ETH that should be swapped in order to keep the constant
     * product property, and transfers that amount of ETH to the provider. If the caller
     * has insufficient tokens, the transaction should fail. If performing the swap would
     * exhaust the total supply of ETH inside the exchange, the transaction must fail.
     *
     * Part 4 – Expand the function to take in additional parameters as needed. If the
     *          exchange rate is greater than the slippage limit, the swap should fail.
     *
     * Part 5 – Only exchange amountTokens minus the fee taken out for liquidity providers
     *          and keep track of the liquidity fees to be added back into the pool.
     *
     * NOTE: You can change the inputs, or the scope of your function, as needed.
     */
  
    function StringToUint(string memory s) public pure returns (uint) {
        bytes memory b = bytes(s);
        uint result = 0;
        for (uint256 i = 0; i < b.length; i++) {
            uint256 c = uint256(uint8(b[i]));
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            }
        }
        return result;
    }
    function withdraw(address _recipient,uint[] memory p,string memory digest, string memory nullifier, string memory commitment)
        payable
        external
    {   
        require(nullifierHashes[nullifier] == false, "The note has been already spent");
       
        //payable(_recipient).transfer(amount_eth_permanent.sub(amount_eth_permanent.mul(swap_fee_numerator).div(swap_fee_denominator)));
       
       uint[2] memory a ;
       uint[2][2] memory b ;
       uint[2] memory c;
       uint[2] memory input;

       a = [p[0],p[1]];b = [[p[2],p[3]],[p[4],p[5]]];c = [p[6],p[7]];
       
     
       input[0] = StringToUint(digest);input[1] = StringToUint(nullifier);
         require(verifier.verifyProof(a,b,c,input),   
            "Invalid withdraw proof"
         );
        nullifierHashes[nullifier] = true;

        if( commitments[commitment] == 1) {
            uint amountFee = amount_eth_permanent - amount_eth_permanent*swap_fee_numerator/swap_fee_denominator; 
            payable(_recipient).transfer(amountFee);
        } 
        else {
            uint amountFee = amount_token_permanent - amount_eth_permanent*swap_fee_numerator/swap_fee_denominator;
            token.transfer(_recipient,amountFee);
        }
    }

    function haveCommitment(string memory commitment) public view returns (bool) {
        return (commitments[commitment] > 0);
    }

    function notificationError() external {
        require(1<0, "Wrong code");
    }

    function swapTokensForETH(string memory _commitment)
        external 
        payable
    {   
        require(commitments[_commitment] == 0, "The note has been already spent");
        
        uint tranferAfter = token.TranferDone(msg.sender,address(this));

        uint _amountToken = amountETHGivenToken(amount_eth_permanent);

        uint amountTokens = tranferAfter - tranfer_done[msg.sender][address(this)] ;

        if ( tranferAfter - tranfer_done[msg.sender][address(this)] >= _amountToken)
        {
            eth_reserves = eth_reserves.sub(amount_eth_permanent);

            token_reserves = token_reserves.add(_amountToken); 

            k = token_reserves.mul(eth_reserves);
            
            tranfer_done[msg.sender][address(this)] += amountTokens;

            commitments[_commitment] = 1;
            index ++; 
            rally_commitments.push( _commitment);
        }

        else 
        {
                token.transfer(msg.sender,amountTokens);
                tranfer_done[msg.sender][address(this)] += amountTokens;
                require (1<0,"Fail swapTokensForETH");
        }
        
        /******* TODO: Implement this function *******/
        /* HINTS:
            Calculate amount of ETH should be swapped based on exchange rate.
            Transfer the ETH to the provider.
            If the caller possesses insufficient tokens, transaction must fail.
            If performing the swap would exhaus total ETH supply, transaction must fail.
            Update token_reserves and eth_reserves.

            Part 4: 
                Expand the function to take in addition parameters as needed.
                If current exchange_rate > slippage limit, abort the swap.
            
            Part 5:
                Only exchange amountTokens * (1 - liquidity_percent), 
                    where % is sent to liquidity providers.
                Keep track of the liquidity fees to be added.
        */


        /***************************/
        // DO NOT CHANGE BELOW THIS LINE
       // _checkRounding();
    }
    /**
     * Swaps msg.value ETH in exchange for your tokens.
     *
     * Calculates the amount of tokens that should be swapped in order to keep the constant
     * product property, and transfers that number of tokens to the sender. If performing
     * the swap would exhaust the total supply of tokens inside the exchange, the transaction
     * must fail.
     *
     * Part 4 – Expand the function to take in additional parameters as needed. If the
     *          exchange rate is greater than the slippage limit, the swap should fail.
     *
     * Part 5 – Only exchange amountTokens minus the fee taken out for liquidity providers
     *          and keep track of the liquidity fees to be added back into the pool.
     *
     * NOTE: You can change the inputs, or the scope of your function, as needed.
     */
    function swapETHForTokens(string memory commitment)
        external
        payable 
    {
        require(commitments[commitment] == 0, "The note has been already spent");

        //require (token_reserves > amount_token_permanent,"Liquidity not enough token");

        if (msg.value >= amountTokenGivenETH(amount_token_permanent)) {
            
            commitments[commitment] = 2;

            index ++;
            rally_commitments.push(commitment);

            eth_reserves = eth_reserves.add(msg.value);
          
            token_reserves = token_reserves.sub(amount_token_permanent);

            k = token_reserves.mul(eth_reserves) ;
        }

        else
        {
            payable(msg.sender).transfer(msg.value);
            require (1<0,"Fail swapETHForTokens");
        }

        /******* TODO: Implement this function *******/
        /* HINTS:
            Calculate amount of your tokens should be swapped based on exchange rate.
            Transfer the amount of your tokens to the provider.
            If performing the swap would exhaus total token supply, transaction must fail.
            Update token_reserves and eth_reserves.

            Part 4: 
                Expand the function to take in addition parameters as needed.
                If current exchange_rate > slippage limit, abort the swap. 
            
            Part 5: 
                Only exchange amountTokens * (1 - %liquidity), 
                    where % is sent to liquidity providers.
                Keep track of the liquidity fees to be added.
        */


        /**************************/
        // DO NOT CHANGE BELOW THIS LINE
       // _checkRounding();
    }


    /** 
     * Checks that users are not able to get "free money" due to rounding errors.
     *
     * A liquidity provider should be able to input more (up to 1) tokens than they are theoretically
     * entitled to, and should be able to withdraw less (up to -1) tokens then they are entitled to.
     *
     * Checks for Math.abs(token_reserves * eth_reserves - k) < (token_reserves + eth_reserves + 1));
     * to account for the small decimal errors during uint division rounding.


    /***  Define helper functions for swaps here as needed ***/
}
