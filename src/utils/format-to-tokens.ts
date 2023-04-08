import { ethers } from 'ethers'

export const toTokens = (bnObj: any) => {
  return ethers.utils.formatUnits(bnObj.toString(), 'ether');
};

export const toWei = (n: any) => {
  return (n !== 0)
    ? ethers.utils.parseUnits(n, 'ether')
    : 0;
};