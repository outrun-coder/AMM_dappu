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
        const [deployerSharesAmt, lpSharesAmt] = [100, 50];
        const deployerShares = Convert.TokensToWei(deployerSharesAmt);
        const lpShares = Convert.TokensToWei(lpSharesAmt)
        const totalCombinedShares = Convert.TokensToWei(deployerSharesAmt + lpSharesAmt);

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

        // check that deployer has 100 shares
        expect(await ammContract.shares(deployerAddress)).to.equal(deployerShares);

        // Check pool has 100 total shares
        expect(await ammContract.totalShares()).to.equal(deployerShares);


        ///////////////////////
        // LP adds more liquidity
        depositAmount = Convert.TokensToWei(50000);
        
        transaction = await dappuContract.connect(liquidityProvider).approve(ammContract.address, depositAmount);
        await transaction.wait();

        transaction = await musdcContract.connect(liquidityProvider).approve(ammContract.address, depositAmount);
        await transaction.wait();

        // Calc musdc deposit amount;
        let musdcDeposit = await ammContract.claculateMUSDCDepositAmt(depositAmount);

        // LP adds Liquidity
        transaction = await ammContract.connect(liquidityProvider).addLiquidity(depositAmount, musdcDeposit);

        // LP should have 50 shares
        expect(await ammContract.shares(liquidityProviderAddress)).to.equal(lpShares);

        // Deployer should still have 100 shares
        expect(await ammContract.shares(deployerAddress)).to.equal(deployerShares);

        // Pool should have 150 shares
        expect(await ammContract.totalShares()).to.equal(totalCombinedShares);
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