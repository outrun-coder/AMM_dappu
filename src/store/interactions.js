import { ethers } from 'ethers'
import {
  setConnection,
  setNetwork,
  setAccount
} from './reducers/ethers-provider';

import {
  setContracts,
  setSymbols,
  setBalances
} from './reducers/token-contracts';

import {
  setAmmContract
} from './reducers/amm-contract';

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

export const loadAmmContract = async (dispatch, args) => {
  const { chainId, provider } = args;
  // const network = 
  const { amm } = config[chainId];
  const ammContract = new ethers.Contract(amm.address, AMM_ABI, provider);

  dispatch(setAmmContract(ammContract));
  return ammContract;
}

// ! LOAD BALANCES & SHARES

export const loadBalances = async (dispach, args) => {
  const {
    tokenContracts,
    account
  } = args;

  const balances = await tokenContracts.map(async(contract) => {
    const bal = await contract.balanceOf(account);
    return bal;
  });

  dispach(setBalances(balances));
}