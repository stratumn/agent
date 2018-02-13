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

describe('#withKey', () => {
  const testKey = {
    type: 'ed25519'
  };
  const { secretKey } = nacl.keyPair();
  testKey.secret = Buffer.from(secretKey).toString('base64');

  const testExternalSecretKey = Buffer.from(
    'OihdFSC22di2UPIwFObCw5t+XYkdXVcqNVLHq6LuPt3lP0QqTZbhYwzI7Kt9hDQCGmRABxVZATByyXu+myKP8w==',
    'base64'
  );

  runTestsWithDataAndAgent(processCb => {
    it('adds a "key" property to a process', () =>
      processCb()
        .withKey(testKey)
        .key.should.deepEqual({
          type: 'ed25519',
          secret: Buffer.from(testKey.secret, 'base64'),
          public: Buffer.from(
            Buffer.from(testKey.secret, 'base64').slice(nacl.publicKeyLength)
          ).toString('base64')
        }));

    it('adds a "key" property to a segment', () =>
      processCb()
        .createMap('first')
        .then(segment =>
          segment
            .withKey(testKey)
            .key.should.have.properties(['type', 'secret', 'public'])
        ));

    it('the key can be inherited from a parent', () =>
      processCb()
        .withKey(testKey)
        .createMap('first')
        .then(segment =>
          segment.key.should.have.properties(['type', 'secret', 'public'])
        ));

    it('works with a key created externally', () =>
      processCb()
        .withKey({
          type: 'ed25519',
          secret: testExternalSecretKey.toString('base64')
        })
        .createMap('first')
        .then(segment =>
          segment.key.should.deepEqual({
            type: 'ed25519',
            secret: Buffer.from(testExternalSecretKey, 'base64'),
            public: Buffer.from(
              Buffer.from(testExternalSecretKey, 'base64').slice(
                nacl.publicKeyLength
              )
            ).toString('base64')
          })
        ));

    it('fails when signature schema is not handled', () =>
      (() => processCb().withKey({ ...testKey, type: 'unknown' })).should.throw(
        'unknown : Unhandled key type'
      ));

    it('fails when key format is wrong', () =>
      (() => processCb().withKey({ test: 'test' })).should.throw(
        "key object must comply to the format : {type: 'ed25519', secret: 'YOURSECRETKEY'}"
      ));
  });
});
