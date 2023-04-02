const { ethers } = require("hardhat");
const config = require("../src/config.json");


const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
}
const ether = tokens;
const shares = ether;

async function main() {
  // Fetch accounts
  console.log(`>> Fetching accounts & networks \n`);
  const accounts = await ethers.getSigners();
  const [
    deployer,
    investor_1,
    investor_2,
    investor_3,
    investor_4,
  ] = accounts;

  // Fetch Network
  const { chainId } = await ethers.provider.getNetwork();
  const network = config[chainId];
  console.log(`>> Using network:`, network);
  
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});