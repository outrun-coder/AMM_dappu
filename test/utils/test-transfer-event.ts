import { expect } from 'chai';

interface TestReqs {
  transferEvents: Array<any>;
  fromAddress: string;
  toAddress: string;
  transferAmount: number;
}


export const testTransferEvent = (testRequirements: TestReqs) => {
  const { transferEvents, fromAddress, toAddress, transferAmount } = testRequirements;
  // console.log('>> FOUND_XFER_EVENTS:', transferEvents);

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(transferEvents).to.not.be.empty
    //
    const eventArgs = transferEvents[0].args;
    expect(eventArgs.from).to.equal(fromAddress);
    expect(eventArgs.to).to.equal(toAddress);
    expect(eventArgs.value).to.equal(transferAmount);

    return true;
  } catch(err) {
    console.error('\n (!) testTransferEvent FAILED (!):', err);
    return false;
  }
};