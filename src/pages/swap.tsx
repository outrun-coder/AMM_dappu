import * as React from "react"
import { HeadFC, PageProps } from "gatsby"

import SwapInterface from '../components/interface/Swap';

const SwapPage: React.FC<PageProps> = () => {
  return (<SwapInterface/>)
}

export default SwapPage

export const Head: HeadFC = () => <title>SWAP Page</title>
