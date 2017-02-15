/*
    Stratumn Agent Javascript Library
    Copyright (C) 2017  Stratumn SAS

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
