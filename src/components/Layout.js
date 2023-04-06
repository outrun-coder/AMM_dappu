import React from 'react';

import { Provider } from "react-redux"
import { ammStore } from "../store/amm-store"

import App from './app';
import NavDemoRoutes from '../components/nav-demo-routes.js';

import '../index.css';
import 'bootstrap/dist/css/bootstrap.css'

const Layout = ({children}) => {
  return (
    <Provider store={ammStore}>
      <App>
        <NavDemoRoutes/>
        {children}
      </App>
    </Provider>
  );
}

export default Layout;