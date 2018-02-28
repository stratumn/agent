import { REHYDRATE } from 'redux-persist';
import { expect } from 'chai';

import uploadKey from './uploadKey';
import * as actionTypes from '../constants/actionTypes';

import { TestKeyBuilder } from '../test/builders/state';

describe('uploadKey reducer', () => {
  const testKey = new TestKeyBuilder()
    .withSecret('secret')
    .withPublic('public')
    .withType('type')
    .build();

  it('returns previous state for unknown action', () => {
    const initialState = { random: 'junk' };
    const newState = uploadKey(initialState, { type: 'UNKNOWN_ACTION' });
    expect(newState).to.eql(initialState);
  });

  it('updates state when the uploading failed', () => {
    const initialState = { random: 'junk' };
    const expectedState = { error: 'test', status: 'FAILED' };
    const newState = uploadKey(initialState, {
      type: actionTypes.UPLOAD_KEY_FAILURE,
      error: 'test'
    });
    expect(newState).to.deep.equal(expectedState);
  });

  it('updates state when successfully uploading a key', () => {
    const initialState = {};
    const expectedState = { ...testKey, ...{ status: 'LOADED' } };
    const newState = uploadKey(initialState, {
      type: actionTypes.UPLOAD_KEY_SUCCESS,
      key: testKey
    });
    expect(newState).to.deep.equal(expectedState);
  });

  it('updates state when deleting the key', () => {
    const initialState = { key: {} };
    const expectedState = null;
    const newState = uploadKey(initialState, {
      type: actionTypes.KEY_DELETE
    });
    expect(newState).to.deep.equal(expectedState);
  });

  it('updates state when rehydrating the state', () => {
    const initialState = {};
    const expectedState = {
      ...testKey,
      ...{ status: 'LOADED', secret: Buffer.from('secret') }
    };
    const newState = uploadKey(initialState, {
      type: REHYDRATE,
      payload: {
        key: {
          type: 'type',
          public: 'public',
          secret: { data: 'secret' }
        }
      }
    });
    expect(newState).to.deep.equal(expectedState);
  });

  it('handles an empty payload', () => {
    const initialState = testKey;
    const newState = uploadKey(initialState, {
      type: actionTypes.REHYDRATE,
      payload: null
    });
    expect(newState).to.deep.equal(initialState);
  });
});
