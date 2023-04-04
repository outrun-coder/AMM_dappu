import { ethers } from 'ethers'
import {
  setConnection,
  setNetwork,
  setAccount
} from './reducers/ethers-provider';

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