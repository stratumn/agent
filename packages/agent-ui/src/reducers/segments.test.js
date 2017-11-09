import { expect } from 'chai';

import segments from './segments';
import * as actionTypes from '../constants/actionTypes';
import * as statusTypes from '../constants/status';

describe('segments reducer', () => {
  it('returns previous state for unknown action', () => {
    const initialState = { random: 'junk' };
    const newState = segments(initialState, { type: 'UNKNOWN_ACTION' });
    expect(newState).to.eql(initialState);
  });

  it('update state when fetching segments', () => {
    const newState = segments(
      {},
      {
        type: actionTypes.SEGMENTS_REQUEST
      }
    );
    const expected = { status: statusTypes.LOADING, details: [] };
    expect(newState).to.deep.equal(expected);
  });

  it('update state on failure', () => {
    const newState = segments(
      {},
      {
        type: actionTypes.SEGMENTS_FAILURE,
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
    const segs = [{ meta: { linkHash: 'abc' } }, { meta: { linkHash: 'def' } }];
    const linkHashes = segs.map(({ meta: { linkHash } }) => linkHash);
    const newState = segments(
      {},
      {
        type: actionTypes.SEGMENTS_SUCCESS,
        segments: segs
      }
    );
    const expected = {
      status: statusTypes.LOADED,
      details: linkHashes
    };
    expect(newState).to.deep.equal(expected);
  });
});
