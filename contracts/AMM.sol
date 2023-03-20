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

  constructor(AmmDeploymentAgs memory args) {
    dappuTokenContract = args._token1Address;
    musdcTokenContract = args._token2Address;
  }
}