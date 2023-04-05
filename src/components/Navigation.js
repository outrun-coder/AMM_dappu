import * as React from "react"
import { useSelector } from 'react-redux';
import Blockies from 'react-blockies';

import Navbar from 'react-bootstrap/Navbar';

import logo from './logo.png';

const Navigation = () => {
  const account = useSelector(state => state.ethersProvider.account);

  const truncatedAccount = (account) ? `${account.slice(0,5)}...${account.slice(38, 42)}` : 'N/A';

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
        {(account) ? (
          <Navbar.Text>
            {truncatedAccount}
            <Blockies
              seed={account}
              size={10}
              scale={3}
              color="#2187D0"
              bgColor="#F1F2F9"
              spotColor="#767F92"
              className="identicon mx-2"/>
          </Navbar.Text>
        ) : (
          <>Loading...</>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
