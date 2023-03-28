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
}