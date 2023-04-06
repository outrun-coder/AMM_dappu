import React from 'react';
import { Link } from 'gatsby';

const NavDemoRoutes = () => {
  return (
    <>
      <Link to="/">Home</Link>
      <Link to="/swap">Swap</Link>
      <Link to="/deposit">Deposit</Link>
      <Link to="/withdraw">Witdraw</Link>
      <Link to="/charts">Charts</Link>
    </>
  );
}

export default NavDemoRoutes;