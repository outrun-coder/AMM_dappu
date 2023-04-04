import * as React from "react"

import { useEffect, useState } from 'react'
import { useDispatch } from "react-redux"

import { Container } from 'react-bootstrap'
import { ethers } from 'ethers'

// Components
import Navigation from './Navigation';
import Loading from './Loading';

// ABIs: Import your contract ABIs here
// import DAO_ABI from '../abis/DAO.json'

// Config: Import your network config here
import config from '../config.json';

import { loadAccount } from "../store/interactions"

function App() {
  const dispatch = useDispatch();

  const [provider, setProvider] = useState(null);
  // const [daoContract, setDaoContract] = useState(null);

  let account = '0x0...';
  // const [account, setAccount] = useState(null)

  const [isLoading, setIsLoading] = useState(true)

  const loadBlockchainData = async () => {
    // const network = 
    const { token, dao } = config[31337];

    // Initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    // initialize contracts
    // const daoContract = new ethers.Contract(dao.address, DAO_ABI, provider);
    // setDaoContract(daoContract);

    // Fetch accounts
    await loadAccount(dispatch);

    setIsLoading(false)
  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading]);

  return(
    <Container>
      <Navigation account={account} />

      <h1 className='my-4 text-center'>Welcome to our AMM!</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <h1>App interface goes here!</h1>
        </>
      )}
    </Container>
  );
}

export default App;
