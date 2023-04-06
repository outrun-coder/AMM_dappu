import React from 'react';

import { Provider } from "react-redux"
import { ammStore } from "../store/amm-store"

import App from './app';
import NavDemoRoutes from '../components/nav-demo-routes.js';
import NavTabs from '../components/nav-tabs.js';

import '../index.css';
import 'bootstrap/dist/css/bootstrap.css'

const Layout = ({children}) => {
  return (
    <Provider store={ammStore}>
      <App>
        <NavTabs/>
        {children}
      </App>
    </Provider>
  );
}

export default Layout;