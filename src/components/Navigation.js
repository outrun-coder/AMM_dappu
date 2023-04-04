import * as React from "react"
import { useSelector } from 'react-redux';

import Navbar from 'react-bootstrap/Navbar';

import logo from './logo.png';

const Navigation = () => {
  const account = useSelector(state => state.ethersProvider.account);

  const truncatedAccount = `${account.slice(0,5)}...${account.slice(38, 42)}`

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
        <Navbar.Text>
          {truncatedAccount}
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
