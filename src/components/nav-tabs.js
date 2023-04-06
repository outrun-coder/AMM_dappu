import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from 'gatsby';

const NavTabs = () => {

  return (
    <Nav variant="pills" className="interface-nav center my-4">
      <Nav.Link as={Link} activeClassName="active" to="/">Home</Nav.Link>
      <Nav.Link as={Link} activeClassName="active" to="/swap">Swap</Nav.Link>
      <Nav.Link as={Link} activeClassName="active" to="/deposit">Deposit</Nav.Link>
      <Nav.Link as={Link} activeClassName="active" to="/withdraw">Withdraw</Nav.Link>
      <Nav.Link as={Link} activeClassName="active" to="/charts">Charts</Nav.Link>
    </Nav>
  );
}

export default NavTabs;
