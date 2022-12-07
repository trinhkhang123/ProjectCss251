const hre = require("hardhat");

async function main() {
const Token = await hre.ethers.getContractFactory("TokenExchange");
	const token = await Token.deploy();
	await token.deployed();
	console.log(`TokenExchange contract address: ${token.address}`);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});

	//SpendVerifier
	//Token
	//TokenExchange