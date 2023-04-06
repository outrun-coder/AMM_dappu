import * as React from "react"
import { HeadFC, PageProps } from "gatsby"

const IndexPage: React.FC<PageProps> = () => {
  return (
    <>
      <h1 className='my-4 text-center'>Welcome to our AMM!</h1>
      <h1>INDEX - HOME</h1>
    </>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
