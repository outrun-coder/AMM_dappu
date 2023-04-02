// ! DYNAMIC DEPLOYMENT OF TARGET CONTRACT

import { ethers } from "hardhat";

const DEPLOYMENT_TARGET = 'AMM';

async function main(): Promise<void> {
  // ! - t1 - DAPPU
  const t1ContractFactory = await ethers.getContractFactory('Token');
  const t1Contract = await t1ContractFactory.deploy('Dapp U', 'DAPPU', '1000000');
  await t1Contract.deployed();
  console.log(`DAPPU Token deployed to: ${t1Contract.address}\n`);

  // ! - t2 - MUSDC
  const t2ContractFactory = await ethers.getContractFactory('Token');
  const t2Contract = await t2ContractFactory.deploy('Mock USDC', 'MUSDC', '1000000');
  await t2Contract.deployed();
  console.log(`MUSDC Token deployed to: ${t2Contract.address}\n`);


  // ! - AMM
  const ammContractFactory = await ethers.getContractFactory('AMM');
  const ammContract = await ammContractFactory.deploy({
    _token1Address: t1Contract.address,
    _token2Address: t2Contract.address,
  });
  console.log(`AMM contract deployed to: ${ammContract.address}`);

  // - Print result
  // console.log('\n\n>> CONTRACT DEPLOYED!');
  // console.table({ address: migrated.address });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
