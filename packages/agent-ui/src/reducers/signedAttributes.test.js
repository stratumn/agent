import { expect } from 'chai';

import signedAttributes from './signedAttributes';
import * as actionTypes from '../constants/actionTypes';

describe('signedAttributes reducer', () => {
  it('returns previous state for unknown action', () => {
    const initialState = { random: 'junk' };
    const newState = signedAttributes(initialState, { type: 'UNKNOWN_ACTION' });
    expect(newState).to.eql(initialState);
  });

  it('updates state when modifying the checkboxes ', () => {
    const initialState = { random: 'junk' };
    const expectedState = { prevLinkHash: true };
    const newState = signedAttributes(initialState, {
      type: actionTypes.UPDATE_SIGNED_ATTRIBUTES,
      signedAttributes: { prevLinkHash: true }
    });
    expect(newState).to.deep.equal(expectedState);
  });

  it('updates state when clearing attributes', () => {
    const initialState = { random: 'junk', signedAttributes: { action: true } };
    const expectedState = null;
    const newState = signedAttributes(initialState, {
      type: actionTypes.CLEAR_SIGNED_ATTRIBUTES
    });
    expect(newState).to.deep.equal(expectedState);
  });
});
