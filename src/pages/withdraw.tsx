import * as React from "react"
import { HeadFC, PageProps } from "gatsby"

import WithdrawInterface from '../components/interface/Withdraw';

const WithdrawPage: React.FC<PageProps> = () => {
  return (<WithdrawInterface/>)
}

export default WithdrawPage

export const Head: HeadFC = () => <title>WITHDRAW Page</title>
