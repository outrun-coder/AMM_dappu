import { ethers } from 'ethers'

export const toTokens = (bnObj: any) => {
  return ethers.utils.formatUnits(bnObj.toString(), 'ether');
};