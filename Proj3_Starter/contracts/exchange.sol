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

contract TokenExchange is Ownable {
    using SafeMath for uint256;
    address public admin;

    address tokenAddr = 0xd7bBE7a7AD3dbC4022Fad12165aB47805Bf9Cf66;                              // TODO: Paste token contract address here.
    Token private token = Token(tokenAddr);         // TODO: Replace "Token" with your token class.             
    mapping (address => uint) provider_eth;
    mapping (address => uint) provider_token;
    // Liquidity pool for the exchange
    uint public token_reserves = 0;
    uint public eth_reserves = 0;

    // Constant: x * y = k
    uint public k;
    
    // liquidity rewards
    uint public swap_fee_numerator = 5;       // TODO Part 5: Set liquidity providers' returns.
    uint public swap_fee_denominator = 100;
    
    event AddLiquidity(address from, uint amount);
    event RemoveLiquidity(address to, uint amount);

    constructor() 
    {
        admin = msg.sender;
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
        k = eth_reserves.mul(token_reserves);
    }

    function priceToken() public view returns (uint) {
        uint multiply = 100;
        return multiply.mul(token_reserves).div(eth_reserves);
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
        return amountToken.mul(priceETH()).div(100);
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
        return amountETH.mul(priceToken()).div(100);
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
    function addLiquidity(uint max_exchange_rate, uint min_exchange_rate ) 
        external 
        payable
        returns(uint)
    {
        amount_token = ((msg.value).mul(eth_reserves)).div(token_reserves);

        require (token.balanceOf(msg.sender) >= amount_token,'Not enough token');

        require ((priceETH() <= max_exchange_rate), "addLiquidity: Fail" );
        
        require ((priceETH() >= min_exchange_rate), "addLiquidity: Fail" );

        //uint token_amount = ((msg.value).mul(token_reserves)).div(eth_reserves);

        eth_reserves = eth_reserves.add(msg.value);
        
        token_reserves = token_reserves.add(amount_token);
        
        k = eth_reserves.mul(token_reserves);
        
        provider_eth[msg.sender] = provider_eth[msg.sender].add(msg.value);

        provider_token[msg.sender] = provider_token[msg.sender].add(amount_token);
        
        emit AddLiquidity(msg.sender, msg.value);

        return amount_token;
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
    function removeLiquidity(uint percent,uint max_exchange_rate, uint min_exchange_rate)
        public 
        payable
    {
        require ((priceToken() <= max_exchange_rate), "addLiquidity: Fail" );
        
        require ((priceToken() >= min_exchange_rate), "addLiquidity: Fail" );

        uint amount_eth = (provider_eth[msg.sender].mul(percent).div(100));

        uint amount_token = (provider_token[msg.sender].mul(percent).div(100));
       
        payable(msg.sender).transfer(amount_eth);

        provider_eth[msg.sender] = provider_eth[msg.sender].sub(amount_eth);

        provider_token[msg.sender] = provider_token[msg.sender].sub(amount_token);

        token_reserves = token_reserves.sub(amount_token);

        eth_reserves = eth_reserves.sub(amount_eth);

        k = token_reserves.mul(eth_reserves);

        token.transfer(msg.sender,amount_token);

        emit RemoveLiquidity(msg.sender, percent);
        /******* TODO: Implement this function *******/
        /* HINTS:
            Calculate the amount of your tokens that should be also removed.
            Transfer the ETH and Token to the provider.
            Update token_reserves, eth_reserves, and k.
            Emit RemoveLiquidity event.
        */
    }

    function removeAllLiquidity(uint max_exchange_rate, uint min_exchange_rate)
        public 
        payable
    {
         require ((priceToken() <= max_exchange_rate), "removeAllLiquidity: Fail" );
        
        require ((priceToken() >= min_exchange_rate), "removeAllLiquidity: Fail" );

        uint amount_eth = provider_eth[msg.sender];

        uint amount_token = provider_token[msg.sender];
       
        payable(msg.sender).transfer(amount_eth);
         
        token.transfer(msg.sender,amount_token);

        provider_eth[msg.sender] = provider_eth[msg.sender].sub(amount_eth);

        provider_token[msg.sender] = provider_token[msg.sender].sub(amount_token);

        token_reserves = token_reserves.sub(amount_token);

        eth_reserves = eth_reserves.sub(amount_eth);

        k = token_reserves.mul(eth_reserves);
    }

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
    function swapTokensForETH(uint amountTokens, uint max_exchange_rate, uint min_exchange_rate)
        external 
        payable
    {   
        
        require (token.balanceOf(msg.sender) >= amountTokens,"User not enough token");

        uint amount_token = amountTokens.sub(amountTokens.mul(swap_fee_numerator).div(swap_fee_denominator));
        
        uint amount_eth = eth_reserves.sub(k.div(token_reserves.add(amount_token)));
        
        require (priceToken() <= max_exchange_rate,"swapETHForTokens: Fail");

        require (priceToken() >= min_exchange_rate,"swapETHForTokens: Fail");
        
        require (amount_eth < eth_reserves, "Liquidity not enough ETH");

        payable(msg.sender).transfer(amount_eth);

        eth_reserves = eth_reserves.sub(amount_eth);

        token_reserves = token_reserves.add(amountTokens); 

        k = token_reserves.mul(eth_reserves);
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
    function swapETHForTokens(uint max_exchange_rate, uint min_exchange_rate)
        external
        payable 
    {

         uint amount_eth = msg.value.sub(msg.value.mul(swap_fee_numerator).div(swap_fee_denominator));

        uint amount_token = (token_reserves).sub(k.div(eth_reserves.add(amount_eth)));

       require (priceToken() <= max_exchange_rate,"swapETHForTokens: Fail");

    require (priceToken() >= min_exchange_rate,"swapETHForTokens: Fail");

       require (token_reserves > amount_token,"Liquidity not enough token");

       token.transfer(msg.sender,amount_token);

       eth_reserves = eth_reserves.add(msg.value);
          
        token_reserves = token_reserves.sub(amount_token);

        k = token_reserves.mul(eth_reserves) ;

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
     */
    function _checkRounding() private {
        uint check = token_reserves * eth_reserves;
        if (check >= k) {
            check = check - k;
        }
        else {
            check = k - check;
        }
        assert(check < (token_reserves + eth_reserves + 1));
        k = token_reserves * eth_reserves;             // reset k due to small rounding errors
    }

    /***  Define helper functions for swaps here as needed ***/
}
