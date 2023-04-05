import * as React from "react"
import { useSelector, useDispatch } from 'react-redux';
import { Button } from "react-bootstrap";
import Blockies from 'react-blockies';
import { delay } from "../utils/delay";

import Navbar from 'react-bootstrap/Navbar';

import logo from './logo.png';

import {
  loadAccount,
  loadBalances
} from '../store/interactions';

const Navigation = () => {
  const [accountIsLoading, setAccountIsLoading] = React.useState(false);
  const dispatch = useDispatch();

  // read
  const tokenContracts = useSelector(state => state.tokenContracts.contracts);
  const currentAccount = useSelector(state => state.ethersProvider.account);
  const truncatedAccount = (currentAccount) ? `${currentAccount.slice(0,5)}...${currentAccount.slice(38, 42)}` : 'N/A';

  // get
  const connectHandler = async () => {
    setAccountIsLoading(true);
    await delay(500);
    const account = await loadAccount(dispatch);
    await loadBalances(dispatch, {
      tokenContracts,
      account
    });
    setAccountIsLoading(false);
  };

  return (
    <Navbar className='my-3'>
      <img
        alt="logo"
        src={logo}
        width="40"
        height="40"
        className="d-inline-block align-top mx-3"
      />
      <Navbar.Brand href="#">Dapp University DAO</Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        {(currentAccount) ? (
          <Navbar.Text>
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
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
