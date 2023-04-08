import { ethers } from 'ethers'
import {
  setAmmContract,
  setShares
} from './toolkit-slices/amm';

import {
  setConnection,
  setNetwork,
  setAccount
} from './toolkit-slices/network';

import {
  setContracts,
  setSymbols,
  setBalances
} from './toolkit-slices/tokens';

import { toTokens } from '../utils/format-to-tokens.ts'

import TOKEN_ABI from '../abis/Token.json';
import AMM_ABI from '../abis/AMM.json';

// Config: Import your network config here
import config from '../config.json';

export const loadProvider = (dispatch) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  dispatch(setConnection(provider));

  return provider
};

export const loadNetwork = async (provider, dispatch) => {
  const { chainId } = await provider.getNetwork();
  dispatch(setNetwork(chainId));

  return chainId;
};

export const loadAccount = async (dispatch) => {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const account = ethers.utils.getAddress(accounts[0]);
  dispatch(setAccount(account));

  return account;
}

// ! LOAD CONTRACTS

export const loadTokenContracts = async (dispatch, args) => {
  const { chainId, provider } = args;

  const hasProjectConfigForChain = config[chainId] != undefined;

  if (hasProjectConfigForChain) {
    // const network = 
    const { dappu, musdc } = config[chainId];
    const dappuContract = new ethers.Contract(dappu.address, TOKEN_ABI, provider);
    const musdcContract = new ethers.Contract(musdc.address, TOKEN_ABI, provider);
  
    const contracts = [
      dappuContract,
      musdcContract
    ];
  
    const symbols = [
      await dappuContract.symbol(),
      await musdcContract.symbol()
    ]
  
    dispatch(setContracts(contracts));
    dispatch(setSymbols(symbols));
    return contracts;
  }
}

export const loadAmmContract = async (dispatch, args) => {
  const { chainId, provider } = args;

  const hasProjectConfigForChain = config[chainId] != undefined;

  if (hasProjectConfigForChain) {
    // const network = 
    const { amm } = config[chainId];
    const ammContract = new ethers.Contract(amm.address, AMM_ABI, provider);
  
    dispatch(setAmmContract(ammContract));
    return ammContract;
  }
}

// ! LOAD BALANCES & SHARES

export const loadBalances = async (dispatch, args) => {
  const {
    tokenContracts,
    ammContract,
    account
  } = args;

  // TODO - USE A PROMISE.ALL()
  // const balances = await tokenContracts.map(async(contract) => {
  //   const bal = await contract.balanceOf(account);
  //   return bal;
  // });

  // REPLACE - WITH ABOVE
  // const balances = 
  const balance1 = await tokenContracts[0].balanceOf(account);
  const balance2 = await tokenContracts[1].balanceOf(account);

  dispatch(setBalances([
    toTokens(balance1),
    toTokens(balance2)
  ]));

  const shares = await ammContract.shares(account);
  dispatch(setShares(toTokens(shares)));
}

// ! SWAP

export const requestSwap = async (args) => {
  // config
  const testing = false;

  // pre-flight
  const {
    provider,
    ammContract,
    tokenContract,
    symbol,
    amount,
    dispatch
  } = args;

  // dynamic args
  const SWAP_METHODS = {
    DAPPU: 'swapDappu',
    MUSDC: 'swapMusdc'
  };
  const swapMethod = SWAP_METHODS[symbol];

  try {
    // send it...
    let trx;
    const signer = await provider.getSigner();
  
    console.log(`>> WILL USE: ${swapMethod}`);
    console.table({
      symbol,
      amount: toTokens(amount),
      testing
    });
    if (!testing) {
      
      console.log(`>> Approving transferFrom request...`);
      trx = await tokenContract.connect(signer).approve(ammContract.address, amount);

      console.log(`Sending swap request`);
      trx = await ammContract.connect(signer)[swapMethod](amount);
      
      await trx.wait();

    }

    return;
  } catch(err) {
    // TODO - LOG ERROR AND GRACEFULLY FAIL
    console.error(`>> SWAP REQUEST FAILED! ERROR:`, err);
  }

};