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
  let investor_1: any;
  let investor_1Address: string;
  //
  let investor_2: any;
  let investor_2Address: string;
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
      investor_1,
      investor_2,
      exchange
    ] = accounts;
    // COLLECT ACTOR ADDRESSES
    deployerAddress = deployer.address;
    liquidityProviderAddress = liquidityProvider.address;
    investor_1Address = investor_1.address;
    investor_2Address = investor_2.address;
    exchangeAddress = exchange.address;

    //
    const lpDistAmount = Convert.TokensToWei(100000);

    // ! TOKEN: DAPP
    const contractFactory_0 = await ethers.getContractFactory('Token');
    dappuContract = await contractFactory_0.deploy('Dapp U', 'DAPP', '1000000');
    dappuContractAddress = dappuContract.address;

    // ! TOKEN: MUSDC
    const contractFactory_1 = await ethers.getContractFactory('Token');
    musdcContract = await contractFactory_1.deploy('Mock USDC', 'MUSDC', '1000000');
    musdcContractAddress = musdcContract.address;

    // ! DIST TOKENS TO LIQUIDITY PROVIDER    
    transaction = await dappuContract.connect(deployer).transfer(liquidityProviderAddress, lpDistAmount);
    await transaction.wait();
    transaction = await musdcContract.connect(deployer).transfer(liquidityProviderAddress, lpDistAmount);
    await transaction.wait();

    //! Send dappu to investor_1
    transaction = await dappuContract.connect(deployer).transfer(investor_1Address, lpDistAmount);
    await transaction.wait();
    //! Send musdc to investor_2
    transaction = await musdcContract.connect(deployer).transfer(investor_2Address, lpDistAmount);
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
      let depositAmount, transaction, result, estimate, balance;
      const lpDistAmountTest = Convert.TokensToWei(100000);
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

        console.log('\n>> INVESTOR_1\n');

        ///////////////////////
        // Investor 1 swaps dappu => musdc

        // Check PRICE before swap
        console.log(`Before swap price: ${await ammContract.musdcTokenBalance() / await ammContract.dappuTokenBalance()}`);

        // Investor 1 approves all the tokens
        transaction = await dappuContract.connect(investor_1).approve(ammContract.address, lpDistAmountTest)
        await transaction.wait();

        // check investor_1 musdc balance before swap
        balance = await musdcContract.balanceOf(investor_1Address);
        console.log('>> INVESTOR 1 MUSDC BALANCE BEFORE:', balance);

        // estimate amt of tkns inv1 will receive after swapping dappu: include slippage
        const swapWithAmt = Convert.TokensToWei(1);
        estimate = await ammContract.calculateDAPPU_swap(swapWithAmt);
        console.log(`MUSDC amount investor_1 will receive after swap: ${ethers.utils.formatEther(estimate)}`);

        // do the swap!
        transaction = await ammContract.connect(investor_1).swapDappu(swapWithAmt);
        result = await transaction.wait();

        // Check for swap event
        let blockNmuber = await ethers.provider.getBlockNumber();
        let block = await ethers.provider.getBlock(blockNmuber);

        await expect(transaction).to.emit(ammContract, 'Swap')
          .withArgs(
            investor_1Address,
            dappuContractAddress,
            swapWithAmt,
            musdcContractAddress,
            estimate,
            await ammContract.dappuTokenBalance(),
            await ammContract.musdcTokenBalance(),
            block.timestamp
          );

        // Check inv_1 musdc balance
        balance = await musdcContract.balanceOf(investor_1Address);
        console.log(`Investor 1 musdc balance is: ${balance}`);
        
        expect(estimate).to.equal(balance);

        // Verify that AMM token balances are in sync
        expect(await dappuContract.balanceOf(ammContract.address)).to.equal(await ammContract.dappuTokenBalance());
        expect(await musdcContract.balanceOf(ammContract.address)).to.equal(await ammContract.musdcTokenBalance());

        // Check PRICE after swap
        console.log(`After swap price: ${await ammContract.musdcTokenBalance() / await ammContract.dappuTokenBalance()}\n`);


        ///////////////////////
        // Investor 1 swaps AGAIN dappu => musdc

        // check investor_1 musdc balance before swap
        balance = await musdcContract.balanceOf(investor_1Address);
        console.log('>> INVESTOR 1 MUSDC BALANCE BEFORE:', balance);

        // estimate amt of tkns inv1 will receive after swapping dappu: include slippage
        estimate = await ammContract.calculateDAPPU_swap(swapWithAmt);
        console.log(`MUSDC amount investor_1 will receive after swap: ${ethers.utils.formatEther(estimate)}`);

        // do the swap!
        transaction = await ammContract.connect(investor_1).swapDappu(swapWithAmt);
        await transaction.wait();

        // Check inv_1 musdc balance
        balance = await musdcContract.balanceOf(investor_1Address);
        console.log(`Investor 1 musdc balance is: ${balance}`);

        // Verify that AMM token balances are in sync
        expect(await dappuContract.balanceOf(ammContract.address)).to.equal(await ammContract.dappuTokenBalance());
        expect(await musdcContract.balanceOf(ammContract.address)).to.equal(await ammContract.musdcTokenBalance());

        // Check PRICE after swap
        console.log(`After swap price: ${await ammContract.musdcTokenBalance() / await ammContract.dappuTokenBalance()}\n`);


        ///////////////////////
        // Investor 1 swaps AGAIN LRG amount dappu => musdc

        const swapWithLRGAmt = Convert.TokensToWei(100);

        // check investor_1 musdc balance before swap
        balance = await musdcContract.balanceOf(investor_1Address);
        console.log('>> INVESTOR 1 MUSDC BALANCE BEFORE:', balance);

        // estimate amt of tkns inv1 will receive after swapping dappu: include slippage
        estimate = await ammContract.calculateDAPPU_swap(swapWithLRGAmt);
        console.log(`MUSDC amount investor_1 will receive after swap: ${ethers.utils.formatEther(estimate)}`);

        // do the swap!
        transaction = await ammContract.connect(investor_1).swapDappu(swapWithLRGAmt);
        await transaction.wait();

        // Check inv_1 musdc balance
        balance = await musdcContract.balanceOf(investor_1Address);
        console.log(`Investor 1 musdc balance is: ${balance}`);

        // Verify that AMM token balances are in sync
        expect(await dappuContract.balanceOf(ammContract.address)).to.equal(await ammContract.dappuTokenBalance());
        expect(await musdcContract.balanceOf(ammContract.address)).to.equal(await ammContract.musdcTokenBalance());

        // Check PRICE after swap
        console.log(`After swap price: ${await ammContract.musdcTokenBalance() / await ammContract.dappuTokenBalance()} \n`);


        console.log('\n>> INVESTOR_2\n');

        ///////////////////////
        // Investor 2 swaps musdc => dappu

        // Check PRICE before swap
        console.log(`Before swap price: ${await ammContract.dappuTokenBalance() / await ammContract.musdcTokenBalance()}`);

        // Investor 1 approves all the tokens
        transaction = await musdcContract.connect(investor_2).approve(ammContract.address, lpDistAmountTest)
        await transaction.wait();

        // check investor_2 dappu balance before swap
        balance = await dappuContract.balanceOf(investor_2Address);
        console.log('>> INVESTOR 2 DAPPU BALANCE BEFORE:', balance);

        // estimate amt of tkns inv1 will receive after swapping dappu: include slippage
        const swapWithAmt_2 = Convert.TokensToWei(1);
        estimate = await ammContract.calculateMUSDC_swap(swapWithAmt_2);
        console.log(`DAPPU amount investor_2 will receive after swap: ${ethers.utils.formatEther(estimate)}`);

        // do the swap!
        transaction = await ammContract.connect(investor_2).swapMusdc(swapWithAmt_2);
        result = await transaction.wait();

        // Check for swap event
        let blockNmuber_2 = await ethers.provider.getBlockNumber();
        let block_2 = await ethers.provider.getBlock(blockNmuber_2);

        await expect(transaction).to.emit(ammContract, 'Swap')
          .withArgs(
            investor_2Address,
            musdcContractAddress,
            swapWithAmt_2,
            dappuContractAddress,
            estimate,
            await ammContract.dappuTokenBalance(),
            await ammContract.musdcTokenBalance(),
            block_2.timestamp
          );

        // Check inv_2 dappu balance
        balance = await dappuContract.balanceOf(investor_2Address);
        console.log(`Investor 2 dappu balance is: ${balance}`);
        
        expect(estimate).to.equal(balance);

        // Verify that AMM token balances are in sync
        expect(await dappuContract.balanceOf(ammContract.address)).to.equal(await ammContract.dappuTokenBalance());
        expect(await musdcContract.balanceOf(ammContract.address)).to.equal(await ammContract.musdcTokenBalance());

        // Check PRICE after swap
        console.log(`After swap price: ${await ammContract.musdcTokenBalance() / await ammContract.dappuTokenBalance()}\n`);
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