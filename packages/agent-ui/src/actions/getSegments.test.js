import * as StratumnAgentClient from 'stratumn-agent-client';

import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import getSegments from './getSegments';
import { actionTypes } from '../actions';

chai.use(sinonChai);

describe('getSegments action', () => {
  let stratumnClientStub;
  let dispatchSpy;
  let getStateStub;

  beforeEach(() => {
    stratumnClientStub = sinon.stub(StratumnAgentClient, 'getAgent');
    dispatchSpy = sinon.spy();
    getStateStub = sinon.stub();
  });

  afterEach(() => {
    stratumnClientStub.restore();
  });

  it('calls stratumn client to get agent', () => {
    stratumnClientStub.rejects('Unreachable');
    getStateStub.returns({ agents: { foo: { url: '' } } });

    return getSegments('foo')(dispatchSpy, getStateStub).then(() => {
      expect(stratumnClientStub.callCount).to.equal(1);
      expect(getStateStub.callCount).to.equal(1);
    });
  });

  it('starts by dispatching an action to mark as loading', () => {
    stratumnClientStub.rejects('Unreachable');
    getStateStub.returns({ agents: { foo: { url: '' } } });

    return getSegments('foo')(dispatchSpy, getStateStub).then(() => {
      const firstActionDispatched = dispatchSpy.getCall(0).args[0];
      expect(firstActionDispatched.type).to.equal(actionTypes.SEGMENTS_REQUEST);
    });
  });

  it('dispatches a failure action when fetching agent fails', () => {
    stratumnClientStub.rejects('Unreachable');
    getStateStub.returns({ agents: { foo: { url: '' } } });

    return getSegments('foo')(dispatchSpy, getStateStub).then(() => {
      expect(dispatchSpy.callCount).to.equal(2);

      const lastActionDispatched = dispatchSpy.getCall(1).args[0];
      expect(lastActionDispatched.type).to.equal(actionTypes.SEGMENTS_FAILURE);
    });
  });

  it('calls getState', () => {
    stratumnClientStub.rejects('Unreachable');
    getStateStub.returns({ agents: { foo: { url: '' } } });

    return getSegments('foo')(dispatchSpy, getStateStub).then(() => {
      expect(getStateStub.callCount).to.equal(1);
    });
  });

  it('dispatches a failure action when fetching maps fails', () => {
    const findSegmentsStub = sinon.stub().rejects('Unreachable');
    stratumnClientStub.resolves({
      getProcess: () => ({
        findSegments: findSegmentsStub
      })
    });
    getStateStub.returns({ agents: { foo: { url: '' } } });

    return getSegments('foo', 'bar')(dispatchSpy, getStateStub).then(() => {
      expect(findSegmentsStub.callCount).to.equal(1);
      expect(dispatchSpy.callCount).to.equal(2);
      const lastActionDispatched = dispatchSpy.getCall(1).args[0];
      expect(lastActionDispatched.type).to.equal(actionTypes.SEGMENTS_FAILURE);
    });
  });

  it('dispatches a success action when fetching maps succeeds', () => {
    const findSegmentsStub = sinon.stub().resolves(['1', '2']);
    stratumnClientStub.resolves({
      getProcess: () => ({
        findSegments: findSegmentsStub
      })
    });
    getStateStub.returns({ agents: { foo: { url: '' } } });

    return getSegments('foo', 'bar', { opt: 1 })(
      dispatchSpy,
      getStateStub
    ).then(() => {
      expect(findSegmentsStub.callCount).to.equal(1);
      expect(dispatchSpy.callCount).to.equal(2);
      const lastActionDispatched = dispatchSpy.getCall(1).args[0];
      expect(lastActionDispatched.type).to.equal(actionTypes.SEGMENTS_SUCCESS);
      expect(lastActionDispatched.segments).to.eql(['1', '2']);
    });
  });
});
