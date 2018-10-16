/*
  Copyright 2016-2018 Stratumn SAS. All rights reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import pluginTest from '.';
import encryptedState from '../../src/plugins/encryptedState';
import hashJson from '../../src/hashJson';

function test(segment) {
  segment.link.state.should.eql({ encrypted: 1 });
  return segment.link.meta.data.encryptedState.should.be.ok;
}

let state;

const dummyEncryption = {
  encryptState(link) {
    ({ state } = link);
    return 1;
  },

  decryptState(link) {
    if (link.meta.data.encryptedState) {
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
    return (l.meta.data.encryptedState === null).should.be.true;
  }
});

describe('encryptedState', () => {
  describe('#filterSegment()', () => {
    it('accepts only segment it can decrypt', done => {
      state = 'dummy';
      const eState = '';
      const s1 = {
        link: {
          state: eState,
          meta: { data: { encryptedState: true, stateHash: hashJson(state) } }
        }
      };
      const s2 = { link: { state: {}, meta: { data: {} } } };

      encryptedState(dummyEncryption)
        .filterSegment(s1)
        .then(result => result.should.be.ok())
        .then(() => encryptedState(dummyEncryption).filterSegment(s2))
        .then(result => {
          result.should.not.be.ok();
          done();
        })
        .catch(done);
    });
  });
});
