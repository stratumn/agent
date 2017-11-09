import * as StratumnAgentClient from 'stratumn-agent-client';

import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { getAgent, removeAgent } from './getAgent';
import * as actionTypes from '../constants/actionTypes';

chai.use(sinonChai);

describe('getAgent action', () => {
  let stratumnClientStub;
  let dispatchSpy;

  beforeEach(() => {
    stratumnClientStub = sinon.stub(StratumnAgentClient, 'getAgent');
    dispatchSpy = sinon.spy();
  });

  afterEach(() => {
    stratumnClientStub.restore();
  });

  it('calls stratumn client to get agent', () => {
    stratumnClientStub.rejects('Unreachable');

    return getAgent('', '')(dispatchSpy).then(() => {
      expect(stratumnClientStub.callCount).to.equal(1);
    });
  });

  it('starts by dispatching an action to mark agent as loading', () => {
    stratumnClientStub.rejects('Unreachable');

    return getAgent('', '')(dispatchSpy).then(() => {
      const firstActionDispatched = dispatchSpy.getCall(0).args[0];
      expect(firstActionDispatched.type).to.equal(
        actionTypes.AGENT_INFO_REQUEST
      );
    });
  });

  it('dispatches a failure action when fetching agent fails', () => {
    stratumnClientStub.rejects('Unreachable');

    return getAgent('invalidAgent', 'http://localhost:80')(
      dispatchSpy
    ).then(() => {
      expect(dispatchSpy.callCount).to.equal(2);

      const lastActionDispatched = dispatchSpy.getCall(1).args[0];
      expect(lastActionDispatched.type).to.equal(
        actionTypes.AGENT_INFO_FAILURE
      );
      expect(lastActionDispatched.name).to.equal('invalidAgent');
    });
  });

  it('dispatches a success action when fetching agent succeeds', () => {
    stratumnClientStub.resolves({ name: 'agent' });

    return getAgent('agent', 'http://localhost:3000')(dispatchSpy).then(() => {
      expect(dispatchSpy.callCount).to.equal(2);

      const lastActionDispatched = dispatchSpy.getCall(1).args[0];
      expect(lastActionDispatched.type).to.equal(
        actionTypes.AGENT_INFO_SUCCESS
      );
      expect(lastActionDispatched.name).to.equal('agent');
    });
  });

  it('dispatches the agent object obtained from the stratumn client', () => {
    const agent = { name: 'agent' };
    stratumnClientStub.resolves(agent);

    return getAgent('agent', 'http://localhost:3000')(dispatchSpy).then(() => {
      expect(dispatchSpy.callCount).to.equal(2);

      const lastActionDispatched = dispatchSpy.getCall(1).args[0];
      expect(lastActionDispatched.agent).to.deep.equal(agent);
    });
  });
});

describe('removeAgent action', () => {
  it('generate a delete action', () => {
    const action = removeAgent('foo');
    expect(action).to.deep.equal({
      type: actionTypes.AGENT_INFO_DELETE,
      name: 'foo'
    });
  });
});
