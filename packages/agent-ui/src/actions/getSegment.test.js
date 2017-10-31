import * as StratumnAgentClient from 'stratumn-agent-client';

import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import getSegment from './getSegment';
import { actionTypes } from '../actions';

chai.use(sinonChai);

describe('getSegment action', () => {
  let stratumnClientStub;
  let getSegmentStub;
  let dispatchSpy;
  let getStateStub;

  beforeEach(() => {
    dispatchSpy = sinon.spy();

    getSegmentStub = sinon.stub();
    stratumnClientStub = sinon.stub(StratumnAgentClient, 'getAgent');
    stratumnClientStub.resolves({
      getProcess: () => ({
        getSegment: getSegmentStub
      })
    });

    getStateStub = sinon.stub();
    getStateStub.returns({
      agents: { a: { url: '' } }
    });
  });

  afterEach(() => {
    stratumnClientStub.restore();
  });

  const verifyDispatchedActions = expectedActionTypes => {
    expect(dispatchSpy.callCount).to.equal(expectedActionTypes.length);
    for (let i = 0; i < expectedActionTypes.length; i += 1) {
      expect(dispatchSpy.getCall(i).args[0].type).to.equal(
        expectedActionTypes[i]
      );
    }
  };

  it('dispatches a failure action on failure', () => {
    getSegmentStub.rejects('Unreachable');

    return getSegment('a', 'p', 'i will fail')(
      dispatchSpy,
      getStateStub
    ).then(() => {
      verifyDispatchedActions([
        actionTypes.SEGMENT_REQUEST,
        actionTypes.SEGMENT_FAILURE
      ]);
    });
  });

  it('dispatches the segment on success', () => {
    const awesomeSegment = { name: 'awesome' };
    getSegmentStub.resolves(awesomeSegment);

    return getSegment('a', 'p', 'hashMySegment')(
      dispatchSpy,
      getStateStub
    ).then(() => {
      expect(getStateStub.callCount).to.equal(1);

      expect(getSegmentStub.callCount).to.equal(1);
      expect(getSegmentStub.getCall(0).args[0]).to.equal('hashMySegment');

      verifyDispatchedActions([
        actionTypes.SEGMENT_REQUEST,
        actionTypes.SEGMENT_SUCCESS
      ]);

      expect(dispatchSpy.getCall(1).args[0].segment).to.equal(awesomeSegment);
    });
  });
});
