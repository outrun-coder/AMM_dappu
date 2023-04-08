import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  Form,
  InputGroup,
  Dropdown,
  DropdownButton,
  Button,
  Row
} from 'react-bootstrap';

const SwapInterface = () => {
  const account = useSelector(state => state.network.account);
  const ammContract = useSelector(state => state.amm.contract);

  // init
  const [price, setPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // token select
  const [inputToken, setInputToken] = useState(null);
  const [outputToken, setOutputToken] = useState(null);

  const cycleExchangeRate = async () => {
    // switch token selection cases
    if (inputToken === outputToken) {
      // not exchangeable
      setPrice(0);
      return;
    } else {
      // HACK - HARD-CODED exchange rate direction should be replace with: output / input 
      const priceDirection = (inputToken === 'DAPPU')
        ? (await ammContract.dappuTokenBalance() / await ammContract.musdcTokenBalance()) // T1 / T2   ||   DAPPU / MUSDC
        : (await ammContract.musdcTokenBalance() / await ammContract.dappuTokenBalance()) // T2 / T1   ||   MUSDC / DAPPU
      // getPrice
      setPrice(priceDirection);
    } 

    // done
    setIsLoading(false);
  };

  useEffect(() => {
    if (inputToken && outputToken) {
      cycleExchangeRate();
    }
  }, [inputToken, outputToken]);

  return (
    <Form style={{ maxWidth: '450px'}} className="mx-auto px-4">
      <Row className='My-3'>
        <div className="d-flex justify-content-between">
          <Form.Label><strong>Input:</strong></Form.Label>
          <Form.Text muted>Balance:</Form.Text>
        </div>

        <InputGroup id="tokens-in" className="token-alotment">
          <Form.Control
            type="number"
            placeholder="0.0"
            min="0.0"
            step="any"
            value={0}
            disabled={false}
          />

          <DropdownButton
            variant="outline-secondary"
            title={inputToken ? inputToken : "Select Token"}>
              <Dropdown.Item onClick={(e) => setInputToken(e.target.innerHTML)}>DAPPU</Dropdown.Item>
              <Dropdown.Item onClick={(e) => setInputToken(e.target.innerHTML)}>MUSDC</Dropdown.Item>
          </DropdownButton>
        </InputGroup>

      </Row>

      <Row className='My-4'>
        <div className="d-flex justify-content-between">
          <Form.Label><strong>Output:</strong></Form.Label>
          <Form.Text muted>Balance:</Form.Text>
        </div>

        <InputGroup id="tokens-out" className="token-alotment">
          <Form.Control
            type="number"
            placeholder="0.0"
            value={0}
            disabled={false}
          />

          <DropdownButton
            variant="outline-secondary"
            title={outputToken ? outputToken : "Select Token"}>
              <Dropdown.Item onClick={(e) => setOutputToken(e.target.innerHTML)}>DAPPU</Dropdown.Item>
              <Dropdown.Item onClick={(e) => setOutputToken(e.target.innerHTML)}>MUSDC</Dropdown.Item>
          </DropdownButton>
        </InputGroup>
      </Row>

      <Row className='my-3'>
        <Button type='submit'>Swap</Button>
        <Form.Text muted>
          Exchange Rate: {price}
        </Form.Text>
      </Row>
    </Form>
  );
}

export default SwapInterface;