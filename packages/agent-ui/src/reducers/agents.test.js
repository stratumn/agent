import { expect } from 'chai';

import agents from './agents';
import { actionTypes } from '../actions';

import { TestProcessBuilder, TestAgentBuilder } from '../test/builders';

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

  it('updates state when fetching agent failed', () => {
    const initialState = {
      agent1: { status: 'LOADING', url: 'http://localhost:3000' }
    };

    const agentFailureAction = {
      type: actionTypes.AGENT_INFO_FAILURE,
      name: 'agent1',
      error: 'invalid url'
    };

    const failedState = agents(initialState, agentFailureAction);
    expect(failedState.agent1.status).to.equal('FAILED');
    expect(failedState.agent1.error).to.equal('invalid url');
    expect(failedState.agent1.url).to.equal('http://localhost:3000');
  });

  it('handles agents without processes', () => {
    const testAgent = new TestAgentBuilder().build();
    const agentSuccessAction = {
      type: actionTypes.AGENT_INFO_SUCCESS,
      name: 'agent1',
      agent: testAgent
    };

    const loadedState = agents({}, agentSuccessAction);
    expect(loadedState.agent1.status).to.equal('LOADED');
    expect(Object.keys(loadedState.agent1.processes).length).to.equal(0);
  });

  it('updates state with processes details on success', () => {
    const initialState = {
      agent1: { status: 'LOADING', url: 'http://localhost:3000' }
    };

    const testProcess = new TestProcessBuilder('simpleprocess').build();
    const testAgent = new TestAgentBuilder().withProcess(testProcess).build();

    const agentSuccessAction = {
      type: actionTypes.AGENT_INFO_SUCCESS,
      name: 'agent1',
      agent: testAgent
    };

    const loadedState = agents(initialState, agentSuccessAction);
    expect(loadedState.agent1.status).to.equal('LOADED');
    expect(loadedState.agent1.url).to.equal('http://localhost:3000');

    const process = loadedState.agent1.processes.simpleprocess;
    expect(process.name).to.equal('simpleprocess');
  });

  it('updates state with process actions on success', () => {
    const testProcess = new TestProcessBuilder('withActions')
      .withAction('init', ['title'])
      .build();
    const testAgent = new TestAgentBuilder().withProcess(testProcess).build();

    const agentSuccessAction = {
      type: actionTypes.AGENT_INFO_SUCCESS,
      name: 'local',
      agent: testAgent
    };

    const loadedState = agents({}, agentSuccessAction);

    const process = loadedState.local.processes.withActions;
    expect(Object.keys(process.actions).length).to.equal(1);

    const action = process.actions.init;
    expect(action.args.length).to.equal(1);
    expect(action.args[0]).to.equal('title');
  });
});
