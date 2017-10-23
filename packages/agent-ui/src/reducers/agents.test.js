import { expect } from 'chai';

import agents from './agents';
import { actionTypes } from '../actions';

describe('agents reducer', () => {
  it('returns previous state for unknown action', () => {
    const initialState = { random: 'junk' };
    const newState = agents(initialState, { type: 'UNKNOWN_ACTION' });
    expect(newState).to.deep.equal(initialState);
  });

  it('loads new agent and keeps previously loaded agents', () => {
    const initialState = {
      agent1: { status: 'LOADED', url: 'http://localhost:3000', processes: {} }
    };
    const loadAgentAction = {
      type: actionTypes.AGENT_INFO_REQUEST,
      name: 'agent2',
      url: 'http://localhost:3001'
    };
    const newState = agents(initialState, loadAgentAction);
    expect(newState.agent1).to.deep.equal(initialState.agent1);
    expect(newState.agent2.status).to.equal('LOADING');
    expect(newState.agent2.url).to.equal('http://localhost:3001');
    expect(newState.agent2.processes).to.deep.equal({});
  });
});
