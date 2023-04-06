import * as React from "react";
import Layout from './src/components/Layout';

// Wraps every page in a component with persistence
export const wrapPageElement = ({ element, props }) => {
  return (<Layout {...props}>{element}</Layout>);
}