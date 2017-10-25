import { expect } from 'chai';

import maps from './maps';
import { actionTypes } from '../actions';
import { statusTypes } from './';

describe('maps reducer', () => {
  it('returns previous state for unknown action', () => {
    const initialState = { random: 'junk' };
    const newState = maps(initialState, { type: 'UNKNOWN_ACTION' });
    expect(newState).to.eql(initialState);
  });

  it('update state when fetching maps', () => {
    const initialState = { status: 'foo', mapIds: [1, 2, 3] };
    const newState = maps(initialState, { type: actionTypes.MAP_IDS_REQUEST });
    const expected = { status: statusTypes.LOADING, mapIds: [] };
    expect(newState).to.deep.equal(expected);
  });

  it('update state on failure', () => {
    const initialState = { status: 'foo', mapIds: [1, 2, 3] };
    const newState = maps(initialState, {
      type: actionTypes.MAP_IDS_FAILURE,
      error: 'unreachable'
    });
    const expected = {
      status: statusTypes.FAILED,
      mapIds: [1, 2, 3],
      error: 'unreachable'
    };
    expect(newState).to.deep.equal(expected);
  });

  it('update state on success', () => {
    const initialState = { status: 'foo', mapIds: [1, 2, 3] };
    const newState = maps(initialState, {
      type: actionTypes.MAP_IDS_SUCCESS,
      mapIds: [4, 5, 6]
    });
    const expected = {
      status: statusTypes.LOADED,
      mapIds: [4, 5, 6]
    };
    expect(newState).to.deep.equal(expected);
  });
});
