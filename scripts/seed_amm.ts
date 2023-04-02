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

  // Fetch Network Config
  const { chainId } = await ethers.provider.getNetwork();
  const network = config[chainId];
  console.log(`>> Using network:`, network);

  // Fetch Series Contracts
  const dappuTokenContract = await ethers.getContractAt('Token', network.dappu.address);
  console.log(`>> DAPPU Token contract fetched: ${dappuTokenContract.address} \n`);
  

  const musdcTokenContract = await ethers.getContractAt('Token', network.musdc.address);
  console.log(`>> MUSDC Token contract fetched: ${musdcTokenContract.address} \n`);
  
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});