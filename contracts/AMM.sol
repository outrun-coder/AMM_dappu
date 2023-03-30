// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

struct AmmDeploymentAgs {
  Token _token1Address;
  Token _token2Address;
}

// [] Manage Pool
// [] Manage Deposits
// [] Facilitate Swaps (i.e. trades)
// [] Manage Withdraws

contract AMM {
  Token public dappuTokenContract;
  Token public musdcTokenContract;

  uint256 public dappuTokenBalance;
  uint256 public musdcTokenBalance;
  uint256 public K;

  uint256 public totalShares;
  mapping(address => uint256) public shares;

  uint256 constant PRECISION = 10**18;

  constructor(AmmDeploymentAgs memory args) {
    dappuTokenContract = args._token1Address;
    musdcTokenContract = args._token2Address;
  }

  function addLiquidity(uint256 _token1Amount, uint256 _token2Amount) public {
    
    // Deposit Tokes
    require(
      dappuTokenContract.transferFrom(msg.sender, address(this), _token1Amount),
      'Failed to transfer DAPP token'
    );
    require(
      musdcTokenContract.transferFrom(msg.sender, address(this), _token2Amount),
      'Failed to transfer MUSDC token'
    );
    
    // Issue Shares
    uint claculatedShare;
    if (totalShares == 0) {
      // FIRST TIME LP
      claculatedShare = 100 * PRECISION;
    } else {
      // ADDITIONAL CONTRIBUTION
      uint256 share1 = (totalShares * _token1Amount) / dappuTokenBalance;
      uint256 share2 = (totalShares * _token2Amount) / musdcTokenBalance;
      require(
        // NOTE - ROUNDING ALLOWS FOR MINISCULE WEI AMOUNTS TO BE NORMALIZED FOR COMPARISON - EXPLINATION AT 00:41:36 of W7-Vid_04
        (share1 / 10**3) == (share2 / 10**3),
        "must provide equal token amounts"
      );
      claculatedShare = share1;
    }

    // Manage Pool
    dappuTokenBalance += _token1Amount;
    musdcTokenBalance += _token2Amount;
    K = dappuTokenBalance * musdcTokenBalance;

    // UPDATE SHARES
    totalShares += claculatedShare;
    shares[msg.sender] += claculatedShare;
  }

  // Determine tokens to be withdrawn
  function calculateWitdrawAmount(uint256 _share)
    public
    view
    returns(uint256 dappuAmount, uint256 musdcAmount)
  {
    require(_share <= totalShares, "Shares submitted must be less than or equal to tatal shares");
    dappuAmount = (_share * dappuTokenBalance) / totalShares;
    musdcAmount = (_share * musdcTokenBalance) / totalShares;
  }

  // Removes liquidity
  function removeLiquidity(uint256 _share)
    external
    returns(uint256 dappuAmount, uint256 musdcAmount)
  {
    require(_share <= shares[msg.sender], "Shares submitted must be less than or equal to user's total shares");
    (dappuAmount, musdcAmount) = calculateWitdrawAmount(_share);

    // deduct shares from mapping
    shares[msg.sender] -= _share;
    totalShares -= _share;

    // deduct token balances
    dappuTokenBalance -= dappuAmount;
    musdcTokenBalance -= musdcAmount;

    // TRADERS do not change price / LPs change price
    K = dappuTokenBalance * musdcTokenBalance;

    // tokens back to LP user
    dappuTokenContract.transfer(msg.sender, dappuAmount);
    musdcTokenContract.transfer(msg.sender, musdcAmount);
  }

  // NOTE - fx = (targetTknBalance_b * providedTknAmount_a) / providedTknBalance_a;
  // Determine "dappu" deposit amount for LP of "musdc"
  function claculateDAPPUDepositAmt(uint256 _musdcAmt)
    public
    view
    returns(uint256 dappuAmt)
  {
    dappuAmt = (dappuTokenBalance * _musdcAmt) / musdcTokenBalance;
  }

  // Determine "musdc" deposit amount for LP of "dappu"
  function claculateMUSDCDepositAmt(uint256 _dappuAmt)
    public
    view
    returns(uint256 musdcAmt)
  {
    musdcAmt = (musdcTokenBalance * _dappuAmt) / dappuTokenBalance;
  }

  event Swap(
    address user,
    address tokenGive,
    uint256 tokenGiveAmount,
    address tokenGet,
    uint256 tokenGetAmount,
    uint256 dappuBalance,
    uint256 musdcBalance,
    uint256 timestamp
  );

  // ! DAPPU => MUSDC

  function calculateDAPPU_swap(uint256 _dappuAmount) public view returns(uint musdcAmount) {
    uint256 dappuAfter = dappuTokenBalance + _dappuAmount;
    uint256 musdcAfter = K / dappuAfter;

    musdcAmount = musdcTokenBalance - musdcAfter;

    if(musdcAmount == musdcTokenBalance) {
      musdcAmount--;
    }
  
    require(musdcAmount < musdcTokenBalance, "swap amount cannot exceed pool balance");
  }

  function swapDappu(uint256 _dappuAmount) external returns(uint256 musdcAmount) {
    // calc amount of musdc
    musdcAmount = calculateDAPPU_swap(_dappuAmount);

    // do the swap
    // 1.) Transfer dappu tokens out of user wallet to contract
    dappuTokenContract.transferFrom(msg.sender, address(this), _dappuAmount);
    // 2.) Update the dappu balance in the dex contract
    dappuTokenBalance += _dappuAmount;
    // 3.) Update the musdc balance in the dex contract
    musdcTokenBalance -= musdcAmount;
    // 4.) Transfer musdc tokens from dex to user wallet
    musdcTokenContract.transfer(msg.sender, musdcAmount);

    // emit an event
    emit Swap(
      msg.sender,
      address(dappuTokenContract),
      _dappuAmount,
      address(musdcTokenContract),
      musdcAmount,
      dappuTokenBalance,
      musdcTokenBalance,
      block.timestamp
    );
  }

  // ! MUSDC => DAPPU
  
  function calculateMUSDC_swap(uint256 _musdcAmount) public view returns(uint dappuAmount) {
    uint256 musdcAfter = musdcTokenBalance + _musdcAmount;
    uint256 dappuAfter = K / musdcAfter;

    dappuAmount = dappuTokenBalance - dappuAfter;

    if(dappuAmount == dappuTokenBalance) {
      dappuAmount--;
    }
  
    require(dappuAmount < dappuTokenBalance, "swap amount cannot exceed pool balance");
  }
  
  function swapMusdc(uint256 _musdcAmount) external returns(uint256 dappuAmount) {
    // calc amount of dappu
    dappuAmount = calculateMUSDC_swap(_musdcAmount);

    // do the swap
    // 1.) Transfer dappu tokens out of user wallet to contract
    musdcTokenContract.transferFrom(msg.sender, address(this), _musdcAmount);
    // 2.) Update the dappu balance in the dex contract
    musdcTokenBalance += _musdcAmount;
    // 3.) Update the musdc balance in the dex contract
    dappuTokenBalance -= dappuAmount;
    // 4.) Transfer musdc tokens from dex to user wallet
    dappuTokenContract.transfer(msg.sender, dappuAmount);

    // emit an event
    emit Swap(
      msg.sender,
      address(musdcTokenContract),
      _musdcAmount,
      address(dappuTokenContract),
      dappuAmount,
      dappuTokenBalance,
      musdcTokenBalance,
      block.timestamp
    );
  }
}