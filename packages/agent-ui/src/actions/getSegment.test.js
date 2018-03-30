import * as StratumnAgentClient from '@indigocore/client';

import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import getSegment from './getSegment';
import * as actionTypes from '../constants/actionTypes';
import * as statusTypes from '../constants/status';

chai.use(sinonChai);

describe('getSegment action', () => {
  let stratumnClientStub;
  let getSegmentStub;
  let dispatchSpy;
  let getStateStub;

  const configureState = previousSegment => {
    getStateStub.returns({
      agents: { a: { url: '' } },
      segment: previousSegment
    });
  };

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
    configureState({});
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

  it('does not fetch the segment if already fetched', () => {
    configureState({
      status: statusTypes.LOADED,
      details: { meta: { linkHash: 'l' } }
    });

    return getSegment('a', 'p', 'l')(dispatchSpy, getStateStub).then(() => {
      expect(dispatchSpy.callCount).to.equal(0);
      expect(getSegmentStub.callCount).to.equal(0);
    });
  });

  it('does not fetch the segment if currently loading', () => {
    configureState({
      status: statusTypes.LOADING,
      linkHash: 'l'
    });

    return getSegment('a', 'p', 'l')(dispatchSpy, getStateStub).then(() => {
      expect(dispatchSpy.callCount).to.equal(0);
      expect(getSegmentStub.callCount).to.equal(0);
    });
  });

  it('does not fetch the segment if failed', () => {
    configureState({
      status: statusTypes.FAILED,
      linkHash: 'l'
    });

    return getSegment('a', 'p', 'l')(dispatchSpy, getStateStub).then(() => {
      expect(dispatchSpy.callCount).to.equal(0);
      expect(getSegmentStub.callCount).to.equal(0);
    });
  });

  it('fetches segment if another segment failed', () => {
    configureState({
      status: statusTypes.FAILED,
      linkHash: 'l1'
    });

    return getSegment('a', 'p', 'l2')(dispatchSpy, getStateStub).then(() => {
      expect(getSegmentStub.callCount).to.equal(1);
    });
  });

  it('fetches segment if another segment was previously fetched', () => {
    configureState({
      status: statusTypes.LOADED,
      details: { meta: { linkHash: 'l1' } }
    });

    return getSegment('a', 'p', 'l2')(dispatchSpy, getStateStub).then(() => {
      expect(getSegmentStub.callCount).to.equal(1);
    });
  });

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
