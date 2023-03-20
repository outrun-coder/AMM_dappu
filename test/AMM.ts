import { ethers } from 'hardhat';
import { expect } from 'chai';



describe('AMM_CONTRACT:', () => {
  // ! CONTRACTS
  let tokenContract: any;
  let musdcContract: any;
  let ammContract: any;
  let accounts: any;
  // const bogusAddress = '0x0000000000000000000000000000000000000000';
  //
  let deployer: any;
  let deployerAddress: string;
  //
  let receiver: any;
  let receiverAddress: string;
  //
  let exchange: any;
  let exchangeAddress: string;

  //

  // let transferAmount: any;
  // let transaction: any;
  // let result: any;

  beforeEach(async() => {
    // ! TOKEN: SCRATCH
    const contractFactory_0 = await ethers.getContractFactory('Token');
    tokenContract = await contractFactory_0.deploy('Dapp U', 'DAPP', '1000000');

    // ! TOKEN: MUSDC
    const contractFactory_1 = await ethers.getContractFactory('Token');
    musdcContract = await contractFactory_1.deploy('Mock USDC', 'MUSDC', '1000000');

    //! AMM init
    const contractFactory_2 = await ethers.getContractFactory('AMM');
    ammContract = await contractFactory_2.deploy();

    // ACCOUNTS
    accounts = await ethers.getSigners();
    // DESTRUCTURE ACTORS
    [
      deployer,
      receiver,
      exchange
    ] = accounts;
    // COLLECT ACTOR ADDRESSES
    deployerAddress = deployer.address;
    receiverAddress = receiver.address;
    exchangeAddress = exchange.address;
  });

  
  describe('Deployment:', () => {
    it('Has an address name', async () => {
      // console.log('>> WTH:', ammContract);
      
      expect(ammContract.address).to.not.equal(0x0);
    });
  });

  // describe('TEMP_DESC', () => {
  //   describe('Success', () => {
  //     beforeEach(async () => {
        
  //     });
    
  //     it('TEMP_TEST', (async () => {
        
  //     }));
  //   });
      
  //   describe('Exceptions', () => {
      
  //   });
  // });

});