const { bigInt } = require('snarkjs')
const fs = require('fs')
const assert = require('assert')
const { toWei } = require('web3-utils')
const circomlib = require('circomlib')
const crypto = require('crypto')
const { mimc2 } = require('./mimc')

const rbigint = (nbytes) => bigInt.leBuff2int(crypto.randomBytes(nbytes))

const toHex = (number, length = 32) =>
  '0x' +
  (number instanceof Buffer ? number.toString('hex') : bigInt(number).toString(16)).padStart(length * 2, '0')


function createDeposit(nullifier, secret) {
    let deposit = { nullifier, secret }
    //deposit.preimage = (deposit.secret.to.concat(deposit.nullifier)
    deposit.commitment = mimc2(deposit.nullifier,deposit.secret);
    deposit.nullifierHash = mimc2(nullifier,3)
    return deposit
  }

  createDeposit(1,1)
  async function deposit() {
    const deposit = createDeposit(rbigint(31), rbigint(31))
    console.log('Sending deposit transaction...')
    const tx = await contract.methods
    .deposit(toHex(deposit.commitment))
    .send({ value: toWei(AMOUNT), from: web3.eth.defaultAccount, gas: 2e6 })
  }

  deposit()