const { ethers } = require("hardhat");
const config = require("../src/config.json");


const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
}
const ether = tokens;
const shares = ether;

const STEP_CONTROL = {
  ready: true,
  willDistribute: true,
  willApproveLiquidity: true,
  willAddLiquidity: true,
  i1WillSwapp: true,
  i2WillSwapp: true,
  i4WillSwapp: true
};

async function main() {
  const {
    ready,
    willDistribute,
    willApproveLiquidity,
    willAddLiquidity,
    i1WillSwapp,
    i2WillSwapp,
    i4WillSwapp
  } = STEP_CONTROL;

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
  console.log(`>> AMM contract fetched: ${ammContract.address} \n`);
  

  // ! Dist. tokens to Investors
  console.log(`>> Will dist tokens to investors... \n`);
  
  let trx;
  
  if (ready && willDistribute) {
    console.log(`>> Distributing! \n`);
    // i1 - dappu
    trx = await dappuTokenContract.connect(deployer).transfer(investor_1.address, tokens(10));
    await trx.wait();
    // i2 - musdc
    trx = await musdcTokenContract.connect(deployer).transfer(investor_2.address, tokens(10));
    await trx.wait();
    
    // i3 - dappu
    trx = await dappuTokenContract.connect(deployer).transfer(investor_3.address, tokens(10));
    await trx.wait();
    // i4 - musdc
    trx = await musdcTokenContract.connect(deployer).transfer(investor_4.address, tokens(10));
    await trx.wait();
  }


  // ! Approving Liquidity
  console.log(`>> Will approving Liquidity for AMM...\n`);
  const lpAmount = tokens(100);

  if (ready && willApproveLiquidity) {
    console.log(`>> Approving! \n`);
    // token approval
    trx = await dappuTokenContract.connect(deployer).approve(ammContract.address, lpAmount);
    await trx.wait();
  
    trx = await musdcTokenContract.connect(deployer).approve(ammContract.address, lpAmount);
    await trx.wait();
  }


  // ! DEPLOYER adds liquidity
  console.log(`>> Will add liquidity from DEPLOYER...\n`);

  if (ready && willAddLiquidity) {
    console.log(`>> Adding Liquidity! \n`);
    trx = await ammContract.connect(deployer).addLiquidity(lpAmount, lpAmount);
    await trx.wait();
  }

  // VARS
  const swapApproval = tokens(10);
  const firstSwapAmmount = tokens(1);
  const secondSwapAmmount = tokens(10);

  // ! INVESTOR 1 SWAPPS DAPPU => MUSDC 1
  console.log(`>> INVESTOR_1 will swap 1 DAPPU => MUSDC...\n`);

  if (ready && i1WillSwapp) {
    console.log(`>> i1 approving! \n`);
    trx = await dappuTokenContract.connect(investor_1).approve(ammContract.address, swapApproval);
    await trx.wait();
    console.log(`>> i1 swapping! \n`);
    trx = await ammContract.connect(investor_1).swapDappu(firstSwapAmmount);
    await trx.wait();
  }


  // ! INVESTOR 2 SWAPPS MUSDC => DAPPU 1
  console.log(`>> INVESTOR_2 will swap 1 MUSDC => DAPPU...\n`);

  if (ready && i2WillSwapp) {
    console.log(`>> i2 approving! \n`);
    trx = await musdcTokenContract.connect(investor_2).approve(ammContract.address, swapApproval);
    console.log(`>> i2 swapping! \n`);
    trx = await ammContract.connect(investor_2).swapMusdc(firstSwapAmmount);
    await trx.wait();
  }


  // ! INVESTOR 3 SWAPPS DAPPU => MUSDC 10
  console.log(`>> INVESTOR_3 will swap 10 DAPPU => MUSDC...\n`);
  const i3WillSwapp = true;

  if (ready && i3WillSwapp) {
    console.log(`>> i3 approving! \n`);
    trx = await dappuTokenContract.connect(investor_3).approve(ammContract.address, swapApproval);
    await trx.wait();
    console.log(`>> i3 swapping! \n`);
    trx = await ammContract.connect(investor_3).swapDappu(secondSwapAmmount);
    await trx.wait();
  }


  // ! INVESTOR 4 SWAPPS MUSDC => DAPPU 5
  console.log(`>> INVESTOR_4 will swap 5 MUSDC => DAPPU...\n`);

  if (ready && i4WillSwapp) {
    console.log(`>> i4 approving! \n`);
    trx = await musdcTokenContract.connect(investor_4).approve(ammContract.address, swapApproval);
    console.log(`>> i4 swapping! \n`);
    trx = await ammContract.connect(investor_4).swapMusdc(tokens(5));
    await trx.wait();
  }

  console.log(`>> FINISHED! \n`);
  
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});