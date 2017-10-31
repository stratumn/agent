import { expect } from 'chai';

import createMap from './createMap';

import { actionTypes } from '../actions';

describe('createMap reducer', () => {
  it('sets agent and process names when opening dialog', () => {
    const openState = createMap(
      {},
      {
        type: actionTypes.CREATE_MAP_DIALOG_OPEN,
        agent: 'a',
        process: 'p'
      }
    );

    expect(openState).to.deep.equal({
      showDialog: true,
      agent: 'a',
      process: 'p'
    });
  });

  it('clears agent and process information on dialog close', () => {
    const closedState = createMap(
      { agent: 'a', process: 'p' },
      { type: actionTypes.CREATE_MAP_DIALOG_CLOSE }
    );

    expect(closedState).to.deep.equal({
      showDialog: false
    });
  });

  it('keeps agent and process information during request processing', () => {
    const initialState = {
      showDialog: true,
      agent: 'a',
      process: 'p'
    };

    const validateAgentAndProcess = state => {
      expect(state.agent).to.equal('a');
      expect(state.process).to.equal('p');
    };

    const requestState = createMap(initialState, {
      type: actionTypes.CREATE_MAP_REQUEST
    });
    validateAgentAndProcess(requestState);

    const failedState = createMap(requestState, {
      type: actionTypes.CREATE_MAP_FAILURE
    });
    validateAgentAndProcess(failedState);

    const successState = createMap(requestState, {
      type: actionTypes.CREATE_MAP_SUCCESS
    });
    validateAgentAndProcess(successState);
  });
});
