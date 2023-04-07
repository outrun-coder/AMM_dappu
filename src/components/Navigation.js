import * as React from "react"
import { useSelector, useDispatch } from 'react-redux';
import { 
  Navbar,
  Form,
  Button
} from 'react-bootstrap';
import Blockies from 'react-blockies';
import { delay } from "../utils/delay";

import {
  loadAccount,
  loadBalances
} from '../store/interactions';

import config from '../config.json';

import logo from './logo.png';

const Navigation = () => {
  const [accountIsLoading, setAccountIsLoading] = React.useState(false);
  const dispatch = useDispatch();

  // read
  const chainId = useSelector(state => state.network.chainId);
  const tokenContracts = useSelector(state => state.tokens.contracts);
  const ammContract = useSelector(state => state.amm.contract);
  const currentAccount = useSelector(state => state.network.account);
  const truncatedAccount = (currentAccount) ? `${currentAccount.slice(0,5)}...${currentAccount.slice(38, 42)}` : 'N/A';

  // ! RELOAD PAGE ON NETWORK CHANGE
  window.ethereum.on('chainChanged', () => {
    // ! Teardown(s)
    window.location.reload();
  });

  // get
  const connectHandler = async () => {
    setAccountIsLoading(true);
    await delay(500);
    const account = await loadAccount(dispatch);
    await loadBalances(dispatch, {
      tokenContracts,
      ammContract,
      account
    });

    // ! LISTENER ASSIGNMENT FOR ACCOUNTS_CHANGED 
    window.ethereum.on('accountsChanged', async () => {
      const nextAccount = await loadAccount(dispatch);
      loadBalances(dispatch, {
        tokenContracts,
        ammContract,
        account: nextAccount
      })
    });

    setAccountIsLoading(false);
  };

  const changeNetworkHandler = async(e) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: e.target.value }]
      });
    }catch(err) {
      console.error('Change Network request failed:\n',err);
      alert(err.message);
    }
  };

  return (
    <Navbar className='main-nav my-3' expand="lg">
      <img
        alt="logo"
        src={logo}
        width="40"
        height="40"
        className="d-inline-block align-top mx-3"
      />
      <Navbar.Brand href="#">Dapp University AMM</Navbar.Brand>
      <Navbar.Toggle aria-controls="nav" />
      <Navbar.Collapse id="nav" className="justify-content-end">

        <div className="d-flex justify-content-end mt-3">

          <Form.Select
            aria-label="Network Selector"
            value={config[chainId] ? `0x${chainId.toString(16)}` : `0`}
            onChange={changeNetworkHandler}
            style={{ maxWidth: '200px', marginRight: '20px' }}>
            <option value="0" disabled>Select Network</option>
            <option value="0x7A69">Localhost</option>
            <option value="0x5">Goerli</option>
          </Form.Select>
        
          {(currentAccount) ? (
            <Navbar.Text className="d-flex align-items-center">
              {truncatedAccount}
              <Blockies
                seed={currentAccount}
                size={10}
                scale={3}
                color="#2187D0"
                bgColor="#F1F2F9"
                spotColor="#767F92"
                className="identicon mx-2"/>
            </Navbar.Text>
          ) : (
            <>
              {(accountIsLoading) ? (
                <>Loading...</>
              ) : (
                <Button
                  onClick={connectHandler}>
                    Connect
                </Button>
              )}
            </>
          )}
        
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
