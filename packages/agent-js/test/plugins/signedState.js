/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
