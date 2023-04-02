const { ethers } = require("hardhat");
const config = require("../src/config.json");


const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
}
const ether = tokens;
const shares = ether;

async function main() {
  // ! Fetch accounts
  console.log(`>> Fetching accounts & networks \n`);
  const accounts = await ethers.getSigners();
  const [
    deployer,
    investor_1,
    investor_2,
    investor_3,
    investor_4,
  ] = accounts;


  // ! Fetch Network Config
  const { chainId } = await ethers.provider.getNetwork();
  const network = config[chainId];
  console.log(`>> Using network:`, network);


  // ! Fetch Contract Series
  const dappuTokenContract = await ethers.getContractAt('Token', network.dappu.address);
  console.log(`>> DAPPU Token contract fetched: ${dappuTokenContract.address} \n`);
  

  const musdcTokenContract = await ethers.getContractAt('Token', network.musdc.address);
  console.log(`>> MUSDC Token contract fetched: ${musdcTokenContract.address} \n`);


  const ammContract = await ethers.getContractAt('AMM', network.amm.address);
  console.log(`>> AMM Token contract fetched: ${ammContract.address} \n`);
  

  // ! Dist. tokens to Investors
  console.log(`>> Dist tokens to investors... \n`);
  
  let trx;
  const willDistribute = false;
  
  if (willDistribute) {
    console.log(`>> Distributing! \n`);
    // i1 - dappu
    trx = await dappuTokenContract.connect(deployer).transfer(investor_1.adderss, tokens(10));
    await trx.wait();
    // i2 - musdc
    trx = await musdcTokenContract.connect(deployer).transfer(investor_2.adderss, tokens(10));
    await trx.wait();
    
    // i3 - dappu
    trx = await dappuTokenContract.connect(deployer).transfer(investor_3.adderss, tokens(10));
    await trx.wait();
    // i4 - musdc
    trx = await musdcTokenContract.connect(deployer).transfer(investor_4.adderss, tokens(10));
    await trx.wait();
  }


  // ! Approving Liquidity
  console.log(`>> Approving Liquidity for AMM...\n`);
  const lpAmount = tokens(100);
  const willApproveLiquidity = false;

  if (willApproveLiquidity) {
    console.log(`>> Approving! \n`);
    // token approval
    trx = await dappuTokenContract.connect(deployer).approve(ammContract.address, lpAmount);
    await trx.wait();
  
    trx = await musdcTokenContract.connect(deployer).approve(ammContract.address, lpAmount);
    await trx.wait();
  }

  // ! DEPLOYER adds liquidity
  console.log(`>> Deployer adds liquidity...\n`);
  const willAddLiquidity = false;

  if (willAddLiquidity) {
    console.log(`>> Adding Liquidity! \n`);
    trx = await ammContract.connect(deployer).addLiquidity(lpAmount, lpAmount);
    await trx.wait();
  }
  
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});