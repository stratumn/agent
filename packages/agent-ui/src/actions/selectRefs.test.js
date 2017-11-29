import { expect } from 'chai';

import * as actionTypes from '../constants/actionTypes';
import {
  closeSelectRefsDialog,
  openSelectRefsDialog,
  removeRef,
  addRef,
  clearRefs
} from './selectRefs';

describe('selectRefs actions', () => {
  const testRef = {
    process: '12345',
    linkHash: '54312'
  };

  describe('removeRef', () => {
    it('returns correct type and ref', () => {
      const action = removeRef(testRef);
      expect(action.type).to.deep.equal(actionTypes.SELECT_REFS_REMOVE);
      expect(action.ref).to.deep.equal(testRef);
    });
  });

  describe('addRef', () => {
    it('returns correct type and ref', () => {
      const action = addRef(testRef);
      expect(action.type).to.deep.equal(actionTypes.SELECT_REFS_ADD);
      expect(action.ref).to.deep.equal(testRef);
    });
  });

  [
    {
      action: { closeSelectRefsDialog },
      type: actionTypes.SELECT_REFS_DIALOG_CLOSE
    },
    {
      action: { openSelectRefsDialog },
      type: actionTypes.SELECT_REFS_DIALOG_OPEN
    },
    {
      action: { clearRefs },
      type: actionTypes.SELECT_REFS_CLEAR
    }
  ].forEach(({ action, type }) => {
    const name = Object.keys(action)[0];
    const func = action[name];
    describe(`${name}`, () => {
      it('returns the correct type', () => {
        expect(func()).to.deep.equal({ type });
      });
    });
  });
});
