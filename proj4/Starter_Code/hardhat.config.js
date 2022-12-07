/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-ganache");

module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [process.env.PRV_KEY1, process.env.PRV_KEY2, process.env.PRV_KEY3]
    },
    localganache: {
      url: process.env.PROVIDER_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
  }
};
