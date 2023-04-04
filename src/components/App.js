import * as React from "react"

import { useEffect, useState } from 'react'
import { useDispatch } from "react-redux"

import { Container } from 'react-bootstrap'

// Components
import Navigation from './Navigation';
import Loading from './Loading';

// ABIs: Import your contract ABIs here
// import DAO_ABI from '../abis/DAO.json'

import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadTokenContracts
} from "../store/interactions"

function App() {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true)

  const loadBlockchainData = async () => {
    const provider = loadProvider(dispatch);
    const chainId = await loadNetwork(provider, dispatch);
    const tokenContracts = loadTokenContracts(provider, chainId, dispatch);
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
      <Navigation account={'0x0...'} />

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
