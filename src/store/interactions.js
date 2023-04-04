import { ethers } from 'ethers'
import {
  setConnection,
  setNetwork,
  setAccount
} from './reducers/ethers-provider';

import {
  setContracts
} from './reducers/token-contracts';

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

export const loadTokenContracts = async (provider, chainId, dispatch) => {
  // const network = 
  const { dappu, musdc } = config[chainId];

  const dappuContract = new ethers.Contract(dappu.address, TOKEN_ABI, provider);
  const musdcContract = new ethers.Contract(musdc.address, TOKEN_ABI, provider);

  const contracts = [
    dappuContract,
    musdcContract
  ];

  dispatch(setContracts(contracts));
  return contracts;
}