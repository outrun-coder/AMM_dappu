import * as React from "react"
import { HeadFC, PageProps } from "gatsby"

import ChartsInterface from '../components/interface/Charts';

const ChartsPage: React.FC<PageProps> = () => {
  return (<ChartsInterface/>)
}

export default ChartsPage

export const Head: HeadFC = () => <title>CHARTS Page</title>
