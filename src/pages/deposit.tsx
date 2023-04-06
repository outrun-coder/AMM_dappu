import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"

import { Provider } from "react-redux"
import { ammStore } from "../store/amm-store"

import '../index.css';
import 'bootstrap/dist/css/bootstrap.css'

// @ts-ignore
import App from '../components/App';

const IndexPage: React.FC<PageProps> = () => {
  return (
    <React.StrictMode>
      <Provider store={ammStore}>
        <App>
          <h1>DEPOSIT</h1>
        </App>
      </Provider>
    </React.StrictMode>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>DEPOSIT Page</title>
