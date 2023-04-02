const hre = require("hardhat");
const config = require("../src/config.json");


const tokens = (n) => {
  return hre.ethers.utils.parseUnits(n.toString(), 'ether');
}
const ether = tokens;
const shares = ether;

async function main() {

}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});