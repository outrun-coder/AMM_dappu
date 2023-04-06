import * as React from "react"

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"

import { Container, Card } from 'react-bootstrap'

// Components
import Navigation from './Navigation';
import Loading from './Loading';
import NavTabs from './nav-tabs';

// ABIs: Import your contract ABIs here
// import DAO_ABI from '../abis/DAO.json'

import {
  loadProvider,
  loadNetwork,
  loadTokenContracts,
  loadAmmContract
} from "../store/interactions"

function App({children}) {
  const [isLoading, setIsLoading] = useState(true);

  const account = useSelector(state => state.ethersProvider.account);
  const dispatch = useDispatch();

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
          {account ? (
            <>
              <NavTabs/>

              <Card style={{ maxWidth: '450px' }} className='mx-auto px-4 py-4'>
                {children}
              </Card>
            </>
          ) : (
            <h3>Please connect a wallet.</h3>
          )}
        </div>
      )}
    </Container>
  );
}

export default App;
