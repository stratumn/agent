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

import { runTestsWithDataAndAgent } from './utils/testSetUp';
import { decodeSKFromPEM } from '../src/encoding';

describe('#withKey', () => {
  const testPrivateKey = `-----BEGIN ED25519 PRIVATE KEY-----
BEAu3UcG9B1K7E7YbzeVUJPbU9v62rSQPSr87rCbPkwCg+JRhN20fmXhDtzfHTow
BFVsvHaVt+putNZGntbUraRS
-----END ED25519 PRIVATE KEY-----`;
  const testPublicKey = `-----BEGIN ED25519 PUBLIC KEY-----
MCowBQYDK2VwAyEA4lGE3bR+ZeEO3N8dOjAEVWy8dpW36m601kae1tStpFI=
-----END ED25519 PUBLIC KEY-----`;

  runTestsWithDataAndAgent(processCb => {
    it('adds a "key" property to a process', () =>
      processCb()
        .withKey(testPrivateKey)
        .key.should.deepEqual({
          type: decodeSKFromPEM(testPrivateKey).type,
          secret: decodeSKFromPEM(testPrivateKey).secretKey,
          public: testPublicKey
        }));

    it('adds a "key" property to a segment', () =>
      processCb()
        .createMap('first')
        .then(segment =>
          segment
            .withKey(testPrivateKey)
            .key.should.have.properties(['type', 'secret', 'public'])
        ));

    it('the key can be inherited from a parent', () =>
      processCb()
        .withKey(testPrivateKey)
        .createMap('first')
        .then(segment =>
          segment.key.should.have.properties(['type', 'secret', 'public'])
        ));

    it('fails when signature schema is not handled', () =>
      (() =>
        processCb().withKey(
          `-----BEGIN UNKNOWN PRIVATE KEY-----
BEAu3UcG9B1K7E7YbzeVUJPbU9v62rSQPSr87rCbPkwCg+JRhN20fmXhDtzfHTow
BFVsvHaVt+putNZGntbUraRS
-----END UNKNOWN PRIVATE KEY-----`
        )).should.throw('Could not parse key: unhandled key type'));

    it('fails when key format is wrong', () =>
      (() => processCb().withKey('test')).should.throw(
        'string is not PEM encoded'
      ));
  });
});
