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

import { sign as nacl } from 'tweetnacl';
import { runTestsWithDataAndAgent } from './utils/testSetUp';

describe('#segmentify', () => {
  const testKey = {
    type: 'ed25519'
  };
  const { secretKey } = nacl.keyPair();
  testKey.secret = Buffer.from(secretKey).toString('base64');

  runTestsWithDataAndAgent(processCb => {
    it('adds actions to the segment', () =>
      processCb()
        .createMap('hi there')
        .then(segment1 =>
          segment1.addMessage('hello', 'me').then(segment2 => {
            segment2.link.meta.prevLinkHash.should.be.exactly(
              segment1.meta.linkHash
            );
            segment2.link.state.messages.should.deepEqual([
              { message: 'hello', author: 'me' }
            ]);
          })
        ));

    it('handles actions errors', () =>
      processCb()
        .createMap('hi there')
        .then(segment1 =>
          segment1
            .addMessage('hello')
            .then(() => {
              throw new Error('should not resolve');
            })
            .catch(err => {
              err.status.should.be.exactly(400);
              err.message.should.be.exactly('an author is required');
            })
        ));

    it('adds a #getPrev() method to the segment', () =>
      processCb()
        .createMap('hi there')
        .then(segment1 =>
          segment1
            .addMessage('hello', 'me')
            .then(segment2 => segment2.getPrev())
            .then(segment3 => {
              segment3.link.should.deepEqual(segment1.link);
              segment3.meta.linkHash.should.be.equal(segment1.meta.linkHash);
              return segment3.getPrev();
            })
            .then(segment4 => {
              (segment4 === null).should.be.exactly(true);
            })
        ));

    it('adds a #withKey() method to the segment', () =>
      processCb()
        .createMap('hi there')
        .then(segment1 => {
          const keySeg = segment1.withKey(testKey);
          keySeg.key.should.have.properties(['type', 'secret', 'public']);
        }));

    it('adds a #sign() method to the segment', () =>
      processCb()
        .createMap('hi there')
        .then(segment1 => {
          const signedSeg = segment1.sign();
          signedSeg.signed.should.deepEqual({
            refs: true,
            action: true,
            inputs: true,
            prevLinkHash: true
          });
        }));

    it('#sign() defines properties to sign', () =>
      processCb()
        .createMap('hi there')
        .then(segment1 => {
          const toSign = { inputs: true };
          const signedSeg = segment1.sign(toSign);
          signedSeg.signed.should.deepEqual(toSign);
        }));

    it('generates a signature if the provided object has a "signed" property', () =>
      processCb()
        .createMap('hi there')
        .then(segment1 =>
          segment1
            .withKey(testKey)
            .sign()
            .addMessage('hello', 'me')
            .then(segment2 => {
              segment2.link.signatures.should.be.an.Array();
              segment2.link.signatures.length.should.be.equal(1);
              segment2.link.signatures[0].should.have.properties([
                'type',
                'publicKey',
                'signature',
                'payload'
              ]);
            })
        ));

    it('provides #sign() with the right data based on the segment\'s "signed" property', () =>
      processCb()
        .createMap('hi there')
        .then(segment1 =>
          segment1
            .withKey(testKey)
            .sign({ prevLinkHash: true })
            .addMessage('hello', 'me')
            .then(segment2 => {
              segment2.link.signatures[0].payload.should.be.exactly(
                '[meta.prevLinkHash]'
              );
            })
        ));

    it('fails when an error occurs while signing the payload', () =>
      processCb()
        .createMap('hi there')
        .then(segment1 =>
          segment1
            .sign()
            .addMessage('hello', 'me')
            .then(() => {
              throw new Error('should have failed');
            })
            .catch(err =>
              err.message.should.be.exactly(
                'key is not defined (use: segment.withKey(key)'
              )
            )
        ));

    it('key can be passed to a process before creating segments', () =>
      processCb()
        .withKey(testKey)
        .createMap('hi there')
        .then(segment1 =>
          segment1
            .sign()
            .addMessage('hello', 'me')
            .then(segment2 => {
              segment2.link.signatures.should.be.an.Array();
            })
        ));

    it('key is passed from a parent segment to its children', () =>
      processCb()
        .createMap('hi there')
        .then(segment1 =>
          segment1
            .withKey(testKey)
            .sign()
            .addMessage('hello', 'me')
            .then(segment2 =>
              segment2
                .sign()
                .addMessage('how are you', 'me')
                .then(segment3 => {
                  segment3.link.signatures.should.be.an.Array();
                })
            )
        ));
  });
});
