import { ethers } from 'ethers'
import { setAccount } from './reducers/ethers-provider';

export const loadAccount = async (dispatch) => {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const account = ethers.utils.getAddress(accounts[0]);
  dispatch(setAccount(account));

  return account;
}