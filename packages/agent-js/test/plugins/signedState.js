/*
  Copyright 2017 Stratumn SAS. All rights reserved.

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
import uuid from 'uuid';
import signedState from '../../src/plugins/signedState';

let signature;

function test(segment) {
  return segment.link.meta.stateSignature.should.equal(signature);
}

const dummySigning = {
  signState() {
    signature = uuid.v4();
    return signature;
  },

  verifySignature(segment, s) {
    return (signature === s);
  }
};

pluginTest(signedState(dummySigning), {
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

describe('signedState', () => {
  describe('#filterSegment()', () => {
    it('accepts only segments that have a legit signature', () => {
      signature = uuid.v4();
      const s1 = {
        link: {
          meta: { stateSignature: signature }
        }
      };
      const s2 = { link: { state: {}, meta: { stateSignature: 'blah' } } };

      return Promise.all([
        signedState(dummySigning).filterSegment(s1),
        signedState(dummySigning).filterSegment(s2)
      ])
      .then(([result1, result2]) => {
        result1.should.be.ok();
        result2.should.not.be.ok();
      });
    });
  });
});
