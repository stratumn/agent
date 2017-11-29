import { expect } from 'chai';

import selectRefs from './selectRefs';
import * as actionTypes from '../constants/actionTypes';

describe('selectRefs reducer', () => {
  const ref = {
    linkHash: 'linkHash',
    process: 'proc'
  };

  it('returns previous state for unknown action', () => {
    const initialState = { random: 'junk' };
    const newState = selectRefs(initialState, { type: 'UNKNOWN_ACTION' });
    expect(newState).to.eql(initialState);
  });

  it('updates state when opening dialog ', () => {
    const initialState = { random: 'junk' };
    const expectedState = { random: 'junk', show: true };
    const newState = selectRefs(initialState, {
      type: actionTypes.SELECT_REFS_DIALOG_OPEN
    });
    expect(newState).to.deep.equal(expectedState);
  });

  it('updates state when closing dialog ', () => {
    const initialState = { random: 'junk' };
    const expectedState = { random: 'junk', show: false };
    const newState = selectRefs(initialState, {
      type: actionTypes.SELECT_REFS_DIALOG_CLOSE
    });
    expect(newState).to.deep.equal(expectedState);
  });

  it('updates the state when removing an exisiting ref', () => {
    const oldRef = {
      linkHash: 'newlinkHash',
      process: 'proc'
    };
    const expectedState = { refs: [oldRef] };
    const newState = selectRefs(
      { refs: [ref, oldRef] },
      {
        type: actionTypes.SELECT_REFS_REMOVE,
        ref
      }
    );
    expect(newState).to.deep.equal(expectedState);
  });

  it('returns previous state when adding a ref that has already been added', () => {
    const initialState = { refs: [ref] };
    const newState = selectRefs(initialState, {
      type: actionTypes.SELECT_REFS_ADD,
      ref
    });
    expect(newState).to.eql(initialState);
  });

  it('updates the state when adding a new ref', () => {
    const newRef = {
      linkHash: 'newlinkHash',
      process: 'proc'
    };
    const expectedState = { refs: [ref, newRef] };
    const newState = selectRefs(
      { refs: [ref] },
      {
        type: actionTypes.SELECT_REFS_ADD,
        ref: newRef
      }
    );
    expect(newState).to.deep.equal(expectedState);
  });

  it('updates state when clearing refs', () => {
    const initialState = { random: 'junk', refs: [ref] };
    const expectedState = { random: 'junk', refs: [] };
    const newState = selectRefs(initialState, {
      type: actionTypes.SELECT_REFS_CLEAR
    });
    expect(newState).to.deep.equal(expectedState);
  });
});
