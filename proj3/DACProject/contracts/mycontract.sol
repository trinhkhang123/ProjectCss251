// SPDX-License-Identifier: UNLICENSED

// DO NOT MODIFY BELOW THIS
pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract Splitwise {
    // DO NOT MODIFY ABOVE THIS

    // ADD YOUR CONTRACT CODE BELOW
  
    address owner; 
    constructor () {
        owner = msg.sender;
    }

    mapping (address => mapping(address => uint32) ) amountOwe;

    address[] users; 

    mapping (address => uint32) tickUser;

    uint32 countUser;

    function lookup(address debtor, address creditor) public view returns (uint32) {
        return amountOwe[debtor][creditor];   
    }

    function addIOU(address creditor, uint32 amount) external returns (bool) {
        if (tickUser[creditor] == 0) {
            tickUser[creditor] = ++countUser;
            users.push(creditor);
        }
        if (tickUser[msg.sender] == 0) {
            tickUser[msg.sender] = ++countUser;
            users.push(msg.sender);
        }
        amountOwe[msg.sender][creditor] += amount; 

        return true;
    }

    function numberNode(address node) public view returns(uint32) {
        return tickUser[node]-1;
    }

    function getUser () public view returns (address[] memory) {
        return  users;
    }

    function getTotalOwed(address userOwe) public view returns(uint32) {
        uint32 total = 0;
        for (uint i = 0;i <countUser ;i++) {
            total += amountOwe[userOwe][users[i]];
        }

        return total; 
    }

    function subIOU(address debtor,address creditor, uint32 amount) external returns(bool) {
        require (msg.sender == owner, 'You are not Admin');
        amountOwe[debtor][creditor] -= amount;
        return true;
    }

    function ownerr (address a) public view returns (bool) {
    if(a == owner) return true;
    else return false;
    }

}
