import { expect } from 'chai';
import { REHYDRATE } from 'redux-persist';
import agents from './agents';
import * as actionTypes from '../constants/actionTypes';
import * as statusTypes from '../constants/status';

import { TestProcessBuilder, TestAgentBuilder } from '../test/builders/api';
import { stat } from 'fs';

describe('agents reducer', () => {
  it('returns previous state for unknown action', () => {
    const initialState = { random: 'junk' };
    const newState = agents(initialState, { type: 'UNKNOWN_ACTION' });
    expect(newState).to.deep.equal(initialState);
  });

  it('loads new agent and keeps previously loaded agents', () => {
    const initialState = {
      agent1: {
        status: statusTypes.LOADED,
        url: 'http://localhost:3000',
        processes: {}
      }
    };

    const loadAgentAction = {
      type: actionTypes.AGENT_INFO_REQUEST,
      name: 'agent2',
      url: 'http://localhost:3001'
    };

    const newState = agents(initialState, loadAgentAction);
    expect(newState.agent1).to.deep.equal(initialState.agent1);
    expect(newState.agent2.status).to.equal(statusTypes.LOADING);
    expect(newState.agent2.url).to.equal('http://localhost:3001');
    expect(newState.agent2.processes).to.deep.equal({});
  });

  it('updates state when fetching agent failed', () => {
    const initialState = {
      agent1: { status: statusTypes.LOADING, url: 'http://localhost:3000' }
    };

    const agentFailureAction = {
      type: actionTypes.AGENT_INFO_FAILURE,
      name: 'agent1',
      error: 'invalid url'
    };

    const failedState = agents(initialState, agentFailureAction);
    expect(failedState.agent1.status).to.equal(statusTypes.FAILED);
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
    expect(loadedState.agent1.status).to.equal(statusTypes.LOADED);
    expect(Object.keys(loadedState.agent1.processes).length).to.equal(0);
  });

  it('updates state with processes details on success', () => {
    const initialState = {
      agent1: { status: statusTypes.LOADING, url: 'http://localhost:3000' }
    };

    const testProcess = new TestProcessBuilder('simpleprocess').build();
    const testAgent = new TestAgentBuilder().withProcess(testProcess).build();

    const agentSuccessAction = {
      type: actionTypes.AGENT_INFO_SUCCESS,
      name: 'agent1',
      agent: testAgent
    };

    const loadedState = agents(initialState, agentSuccessAction);
    expect(loadedState.agent1.status).to.equal(statusTypes.LOADED);
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

  it('updates state with process store on success', () => {
    const testProcess = new TestProcessBuilder('withStore')
      .withStoreAdapter('dummyStore', 'v1', 'c1', 'desc')
      .build();
    const testAgent = new TestAgentBuilder().withProcess(testProcess).build();

    const agentSuccessAction = {
      type: actionTypes.AGENT_INFO_SUCCESS,
      name: 'local',
      agent: testAgent
    };

    const loadedState = agents({}, agentSuccessAction);

    const process = loadedState.local.processes.withStore;
    expect(process.store).to.deep.equal({
      name: 'dummyStore',
      version: 'v1',
      commit: 'c1',
      description: 'desc'
    });
  });

  it('updates state with process fossilizers on success', () => {
    const testProcess = new TestProcessBuilder('withFossilizers')
      .withFossilizer('f1', 'v1', 'c1', 'd1', 'b1')
      .withFossilizer('f2', 'v2', 'c2', 'd2', 'b2')
      .build();
    const testAgent = new TestAgentBuilder().withProcess(testProcess).build();

    const agentSuccessAction = {
      type: actionTypes.AGENT_INFO_SUCCESS,
      name: 'local',
      agent: testAgent
    };

    const loadedState = agents({}, agentSuccessAction);

    const process = loadedState.local.processes.withFossilizers;
    expect(process.fossilizers).to.have.length(2);
    expect(process.fossilizers[0]).to.deep.equal({
      name: 'f1',
      version: 'v1',
      commit: 'c1',
      description: 'd1',
      blockchain: 'b1'
    });
    expect(process.fossilizers[1]).to.deep.equal({
      name: 'f2',
      version: 'v2',
      commit: 'c2',
      description: 'd2',
      blockchain: 'b2'
    });
  });

  it('removes the agent from state on delete action', () => {
    const state = {
      foo: {},
      bar: {}
    };
    const newState = agents(state, {
      type: actionTypes.AGENT_INFO_DELETE,
      name: 'foo'
    });
    expect(newState).to.deep.equal({ bar: {} });
  });

  it('do nothing if name to delete does not exist', () => {
    const state = {
      foo: {},
      bar: {}
    };
    const newState = agents(state, {
      type: actionTypes.AGENT_INFO_DELETE,
      name: 'foobar'
    });
    expect(newState).to.deep.equal({ foo: {}, bar: {} });
  });

  it('change status to STALE on REHYDRATE', () => {
    const state = {
      foo: {
        status: 'foo',
        url: 'foo/url',
        dummy: true
      },
      bar: {
        status: 'bar',
        url: 'bar/url',
        nothing: false
      }
    };
    const newState = agents(state, {
      type: REHYDRATE,
      payload: { agents: state }
    });
    expect(newState).to.deep.equal({
      foo: {
        status: statusTypes.STALE,
        url: 'foo/url'
      },
      bar: {
        status: statusTypes.STALE,
        url: 'bar/url'
      }
    });
  });
});
