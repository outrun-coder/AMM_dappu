import { ethers } from 'hardhat';
import { expect } from 'chai';
import Convert from '../utils/token-conversion';



describe('AMM_CONTRACT:', () => {
  // ! CONTRACTS
  let dappuContract: any;
  let dappuContractAddress: string;
  let musdcContract: any;
  let musdcContractAddress: string;
  let ammContract: any;
  let accounts: any;
  // const bogusAddress = '0x0000000000000000000000000000000000000000';
  //
  let deployer: any;
  let deployerAddress: string;
  //
  let liquidityProvider: any;
  let liquidityProviderAddress: string;
  //
  // let receiver: any;
  // let receiverAddress: string;
  //
  let exchange: any;
  let exchangeAddress: string;

  //

  // let transferAmount: any;
  let transaction: any;
  // let result: any;

  beforeEach(async() => {
    // ! ACCOUNTS
    accounts = await ethers.getSigners();
    // DESTRUCTURE ACTORS
    [
      deployer,
      liquidityProvider,
      // receiver,
      exchange
    ] = accounts;
    // COLLECT ACTOR ADDRESSES
    deployerAddress = deployer.address;
    liquidityProviderAddress = liquidityProvider.address;
    // receiverAddress = receiver.address;
    exchangeAddress = exchange.address;

    //

    // ! TOKEN: DAPP
    const contractFactory_0 = await ethers.getContractFactory('Token');
    dappuContract = await contractFactory_0.deploy('Dapp U', 'DAPP', '1000000');
    dappuContractAddress = dappuContract.address;

    // ! TOKEN: MUSDC
    const contractFactory_1 = await ethers.getContractFactory('Token');
    musdcContract = await contractFactory_1.deploy('Mock USDC', 'MUSDC', '1000000');
    musdcContractAddress = musdcContract.address;

    // ! DIST TOKENS TO LIQUIDITY PROVIDER    
    transaction = await dappuContract.connect(deployer).transfer(liquidityProviderAddress, Convert.TokensToWei(100000));
    await transaction.wait();
    transaction = await musdcContract.connect(deployer).transfer(liquidityProviderAddress, Convert.TokensToWei(100000));
    await transaction.wait();

    //! AMM init
    const contractFactory_2 = await ethers.getContractFactory('AMM');

    ammContract = await contractFactory_2.deploy({
      _token1Address: dappuContractAddress,
      _token2Address: musdcContractAddress,
    });
    
    
  });

  
  describe('Deployment:', () => {
    it('Has an address name', async () => {
      expect(ammContract.address).to.not.equal(0x0);
    });

    it('Returns expected token addresses', async () => {
      expect(await ammContract.dappuTokenContract()).to.equal(dappuContractAddress);
      expect(await ammContract.musdcTokenContract()).to.equal(musdcContractAddress);
    });
  });

    describe('Swapping tokens', () => {
      let depositAmount, transaction, result;
      it('facilitates liquidity depositing', (async () => {
        // Deployer approves 100k tokens
        depositAmount = Convert.TokensToWei(100000);
        transaction = await dappuContract.connect(deployer).approve(ammContract.address, depositAmount);
        await transaction.wait();

        transaction = await musdcContract.connect(deployer).approve(ammContract.address, depositAmount);
        await transaction.wait();

        // Deployer adds Liquidity
        transaction = await ammContract.connect(deployer).addLiquidity(depositAmount, depositAmount);

        // Check AMM recieves tokens
        expect(await dappuContract.balanceOf(ammContract.address)).to.equal(depositAmount);
        expect(await musdcContract.balanceOf(ammContract.address)).to.equal(depositAmount);

        expect(await ammContract.dappuTokenBalance()).to.equal(depositAmount);
        expect(await ammContract.musdcTokenBalance()).to.equal(depositAmount);
      }));
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