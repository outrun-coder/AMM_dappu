import { ethers } from 'hardhat';

const Convert = {
  TokensToWei: (amount: any) => {
    // 1 => 1000000000000000000
    return ethers.utils.parseUnits(amount.toString(), 'ether');
  },
  
  WeiToTokens: (bigNumber: any) => {
    // 1000000000000000000 => 1  
    return ethers.utils.formatEther(bigNumber);
  }
}

export default Convert;