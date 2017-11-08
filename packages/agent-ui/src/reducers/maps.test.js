import { expect } from 'chai';

import maps from './maps';
import * as actionTypes from '../actions/actionTypes';
import * as statusTypes from '../reducers/status';

describe('maps reducer', () => {
  it('returns previous state for unknown action', () => {
    const initialState = { random: 'junk' };
    const newState = maps(initialState, { type: 'UNKNOWN_ACTION' });
    expect(newState).to.eql(initialState);
  });

  it('update state when fetching maps', () => {
    const newState = maps({}, { type: actionTypes.MAP_IDS_REQUEST });
    const expected = { status: statusTypes.LOADING, mapIds: [] };
    expect(newState).to.deep.equal(expected);
  });

  it('update state on failure', () => {
    const newState = maps(
      {},
      {
        type: actionTypes.MAP_IDS_FAILURE,
        error: 'unreachable'
      }
    );
    const expected = {
      status: statusTypes.FAILED,
      error: 'unreachable'
    };
    expect(newState).to.deep.equal(expected);
  });

  it('update state on success', () => {
    const newState = maps(
      {},
      {
        type: actionTypes.MAP_IDS_SUCCESS,
        mapIds: [4, 5, 6]
      }
    );
    const expected = {
      status: statusTypes.LOADED,
      mapIds: [4, 5, 6]
    };
    expect(newState).to.deep.equal(expected);
  });
});
