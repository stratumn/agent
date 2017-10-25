import { expect } from 'chai';

import segments from './segments';
import { actionTypes } from '../actions';
import { statusTypes } from './';

describe('segments reducer', () => {
  it('returns previous state for unknown action', () => {
    const initialState = { random: 'junk' };
    const newState = segments(initialState, { type: 'UNKNOWN_ACTION' });
    expect(newState).to.eql(initialState);
  });

  it('update state when fetching maps', () => {
    const initialState = { status: 'foo', segments: [1, 2, 3] };
    const newState = segments(initialState, {
      type: actionTypes.SEGMENTS_REQUEST
    });
    const expected = { status: statusTypes.LOADING, segments: [] };
    expect(newState).to.be.eql(expected);
  });

  it('update state on failure', () => {
    const initialState = { status: 'foo', segments: [1, 2, 3] };
    const newState = segments(initialState, {
      type: actionTypes.SEGMENTS_FAILURE,
      error: 'unreachable'
    });
    const expected = {
      status: statusTypes.FAILED,
      segments: [1, 2, 3],
      error: 'unreachable'
    };
    expect(newState).to.be.eql(expected);
  });

  it('update state on success', () => {
    const initialState = { status: 'foo', segments: [1, 2, 3] };
    const segs = [{ meta: { linkHash: 'abc' } }, { meta: { linkHash: 'def' } }];
    const linkHashes = segs.map(({ meta: { linkHash } }) => linkHash);
    const newState = segments(initialState, {
      type: actionTypes.SEGMENTS_SUCCESS,
      segments: segs
    });
    const expected = {
      status: statusTypes.LOADED,
      segments: linkHashes
    };
    expect(newState).to.be.eql(expected);
  });
});
