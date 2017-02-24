/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import pluginTest from '.';
import encryptedState from '../../src/plugins/encryptedState';
import hashJson from '../../src/hashJson';

function test(segment) {
  segment.link.state.should.equal(1);
  return segment.link.meta.encryptedState.should.be.ok;
}

let state;

const dummyEncryption = {
  encryptState(link) {
    state = link.state;
    return 1;
  },

  decryptState(link) {
    if (link.meta.encryptedState) {
      return state;
    }
    return {};
  }
};

pluginTest(encryptedState(dummyEncryption), {
  '#createMap()'(segment) {
    test(segment);
  },

  '#createSegment()'(segment) {
    test(segment);
  },

  '#action()'(l) {
    return (l.meta.encryptedState === null).should.be.true;
  }
});

describe('encryptedState', () => {
  describe('#filterSegment()', () => {
    it('accepts only segment it can decrypt', () => {
      state = 'dummy';
      const eState = '';
      const s1 = {
        link: {
          state: eState,
          meta: { encryptedState: true, stateHash: hashJson(state) }
        }
      };
      const s2 = { link: { state: {}, meta: {} } };

      encryptedState(dummyEncryption).filterSegment(s1).should.be.ok();
      encryptedState(dummyEncryption).filterSegment(s2).should.not.be.ok();
    });
  });
});
