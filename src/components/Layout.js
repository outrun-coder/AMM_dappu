import React from 'react';

import { useSelector, Provider } from "react-redux"

import { ammStore } from "../store/amm-store"
import App from './app';

import '../index.css';
import 'bootstrap/dist/css/bootstrap.css'

const Layout = ({children}) => {
  return (
    <Provider store={ammStore}>
      <App>
        {children}
      </App>
    </Provider>
  );
}

export default Layout;