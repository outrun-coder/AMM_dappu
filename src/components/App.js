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
  loadTokenContracts,
  loadAmmContract
} from "../store/interactions"

function App({children}) {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true)

  const loadBlockchainData = async () => {
    const provider = loadProvider(dispatch);
    const chainId = await loadNetwork(provider, dispatch);
    const tokenContracts = await loadTokenContracts(dispatch, {
      chainId,
      provider
    });
    const ammContract = await loadAmmContract(dispatch, {
      chainId,
      provider
    });

    setIsLoading(false)
  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading]);

  return(
    <Container>
      <Navigation/>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="page-container">
          {children}
        </div>
      )}
    </Container>
  );
}

export default App;
