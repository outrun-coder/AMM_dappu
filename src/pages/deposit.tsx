import * as React from "react"
import { HeadFC, PageProps } from "gatsby"

import DepositInterface from '../components/interface/Deposit';

const DepositPage: React.FC<PageProps> = () => {
  return (<DepositInterface/>)
}

export default DepositPage

export const Head: HeadFC = () => <title>DEPOSIT Page</title>
