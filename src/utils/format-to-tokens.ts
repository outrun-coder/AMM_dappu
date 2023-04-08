import { ethers } from 'ethers'

export const toTokens = (bnObj: any) => {
  return ethers.utils.formatUnits(bnObj.toString(), 'ether');
};

export const toWei = (n: any) => {
  return ethers.utils.parseUnits(n, 'ether');
};