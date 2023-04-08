import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Form,
  InputGroup,
  Dropdown,
  DropdownButton,
  Button,
  Row,
  Spinner
} from 'react-bootstrap';

import { toTokens, toWei } from "../../utils/format-to-tokens";
import { delay } from "../../utils/delay";

import {
  requestSwap,
  loadBalances
} from "../../store/interactions";

const SwapInterface = () => {
  const provider = useSelector(state => state.network.connection);
  const account = useSelector(state => state.network.account);

  const tokenContracts = useSelector(state => state.tokens.contracts);
  const symbols = useSelector(state => state.tokens.symbols);
  const balances = useSelector(state => state.tokens.balances);

  const ammContract = useSelector(state => state.amm.contract);
  const {
    isRunning: isSwapping,
    isSuccess,
    transactionHash,
    error: swapError
  } = useSelector(state => state.amm.swapRequest);

  const dispatch = useDispatch();

  // init
  const [price, setPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // token select
  const [inputToken, setInputToken] = useState(null);
  const [outputToken, setOutputToken] = useState(null);
  
  // IO
  const [inputAmount, setInputAmountTo] = useState(0);
  const [outputAmount, setOutputAmountTo] = useState(0);

  const [] = useState(0);

  const cycleExchangeRate = async () => {
    // switch token selection cases
    if (inputToken === outputToken) {
      // not exchangeable
      setPrice(0);
      setOutputAmountTo(0);
      return;
    } else {
      // HACK - HARD-CODED exchange rate direction should be replace with: output / input 
      const priceDirection = (inputToken === 'DAPPU')
        ? (await ammContract.musdcTokenBalance() / await ammContract.dappuTokenBalance()) // T2 / T1   ||   MUSDC / DAPPU
        : (await ammContract.dappuTokenBalance() / await ammContract.musdcTokenBalance()) // T1 / T2   ||   DAPPU / MUSDC
      
      setPrice(priceDirection);

      calcExchangeForAmount();
    } 

    // done
    setIsLoading(false);
  };

  const calcExchangeForAmount = async (e) => {
    let willReceive;
    const enteredValue = (!e) ? inputAmount : e.target.value;
    const IOnotSelected = !inputToken || !outputToken;
    const IOisSame = inputToken === outputToken;
    const canNotQuote = IOnotSelected || IOisSame;

    if (canNotQuote) {
      console.error('>> CAN NOT QUOTE! >>');

      // FIX - DOES NOT RESET INPUT FIELD WHEN FOCUS IS APPLIED
      await delay(2000);
      console.log('... RESETING');
      setInputAmountTo(0);
      setOutputAmountTo(0);
      return;
    }

    setInputAmountTo(enteredValue);
    if (inputToken === 'DAPPU') {
      if (enteredValue <= 0) {
        setOutputAmountTo(0);
        return;
      } else {
        const _dappuAmount = toWei(enteredValue);
        const calcResult = await ammContract.calculateDAPPU_swap(_dappuAmount);
        willReceive = toTokens(calcResult);
  
        setOutputAmountTo(willReceive);
      }
    } else {
      if (enteredValue <= 0) {
        setOutputAmountTo(0);
        return;
      } else {
        const _musdcAmount = toWei(enteredValue);
        const calcResult = await ammContract.calculateMUSDC_swap(_musdcAmount);
        willReceive = toTokens(calcResult);
  
        setOutputAmountTo(willReceive);
      }
    }
  };

  const swapHandler = async (e) => {
    e.preventDefault();
    const symbol = inputToken;
    const targetContract = (symbol === 'DAPPU') ? 0 : 1;
    const tokenContract = tokenContracts[targetContract];
    const amount = toWei(inputAmount);

    if (symbol === outputToken) {
      window.alert('Invalid Token Pair!');
      return;
    }

    if (!amount || amount === 0) {
      window.alert('Please add an input amount.');
      return;
    }

    await requestSwap({
      provider,
      ammContract,
      tokenContract,
      symbol,
      amount,
      dispatch
    });

    await loadBalances(dispatch, {
      tokenContracts,
      ammContract,
      account
    });
    await cycleExchangeRate();
  };

  //

  // TODO - SHOULD BE A UTIL
  const getIOBalanceOf = (token) => {
    const key = symbols.indexOf(token)
    const balance = (key !== -1)
      ? balances[key]
      : 0;
    return parseInt(balance).toFixed(2);
  }

  useEffect(() => {
    if (inputToken && outputToken) {
      cycleExchangeRate();
    }
  }, [inputToken, outputToken]);

  return (
    <Form onSubmit={swapHandler} style={{ maxWidth: '450px'}} className="mx-auto px-4">
      <Row className='My-3'>
        <div className="d-flex justify-content-between">
          <Form.Label><strong>Input:</strong></Form.Label>
          <Form.Text muted>Balance: {getIOBalanceOf(inputToken)}</Form.Text>
        </div>

        <InputGroup id="tokens-in" className="token-alotment">
          <Form.Control
            type="number"
            placeholder="0.0"
            min="0.0"
            step="any"
            onChange={(e) => {calcExchangeForAmount(e)}}
            disabled={!inputToken}
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
          <Form.Text muted>Balance: {getIOBalanceOf(outputToken)}</Form.Text>
        </div>

        <InputGroup id="tokens-out" className="token-alotment">
          <Form.Control
            type="number"
            placeholder="0.0"
            value={ outputAmount === 0 ? "" : outputAmount }
            disabled={!outputToken}
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
        {(isSwapping) ? (
          <Spinner animation="grow" style={{ dispaly: 'block', margin: '0 auto' }}/>
        ) : (
          <Button type='submit'>Swap</Button>
        )}
        <Form.Text muted>
          Exchange Rate: {price}
        </Form.Text>
      </Row>

      {swapError ? (
        <Row className="my-3">
          <div  style={{ dispaly: 'block', margin: '0 auto' }}>
            {swapError}
          </div>
        </Row>
      ) : (<></>)}

      {isSuccess ? (
        <Row className="my-3">
          <div  style={{ display: 'block', margin: '0 auto' }}>
            Swap was successful! 
          </div>
          <div  style={{ display: 'block', margin: '0 auto', fontSize: '8px' }}>
            <strong>{transactionHash}</strong>
          </div>
        </Row>
      ) : (<></>)}
    </Form>
  );
}

export default SwapInterface;