import { expect } from 'chai';

import createMap from './createMap';

import { actionTypes } from '../actions';
import { statusTypes } from './';

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
      dialog: {
        show: true,
        agent: 'a',
        process: 'p'
      },
      request: {}
    });
  });

  it('clears agent and process information on dialog close', () => {
    const closedState = createMap(
      { dialog: { show: true, agent: 'a', process: 'p' } },
      { type: actionTypes.CREATE_MAP_DIALOG_CLOSE }
    );

    expect(closedState).to.deep.equal({
      dialog: {
        show: false
      },
      request: {}
    });
  });

  it('keeps agent and process information during request processing', () => {
    const initialState = {
      dialog: {
        show: true,
        agent: 'a',
        process: 'p'
      }
    };

    const validateState = (state, expectedStatus) => {
      expect(state.dialog.agent).to.equal('a');
      expect(state.dialog.process).to.equal('p');
      expect(state.request.status).to.equal(expectedStatus);
    };

    const requestState = createMap(initialState, {
      type: actionTypes.CREATE_MAP_REQUEST
    });
    validateState(requestState, statusTypes.LOADING);

    const failedState = createMap(requestState, {
      type: actionTypes.CREATE_MAP_FAILURE
    });
    validateState(failedState, statusTypes.FAILED);

    const successState = createMap(requestState, {
      type: actionTypes.CREATE_MAP_SUCCESS
    });
    validateState(successState, statusTypes.LOADED);
  });
});
