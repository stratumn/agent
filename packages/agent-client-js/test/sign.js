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
import { stringify } from 'canonicaljson';
import { runTestsWithDataAndAgent } from './utils/testSetUp';

import { sign, signedProperties, signatureAlgorithms } from '../src/sign';
import { withKey } from '../src/withKey';
import { decodeSignatureFromPEM, decodePKFromPEM } from '../src/encoding';

const testPrivateKey = `-----BEGIN ED25519 PRIVATE KEY-----
BEAu3UcG9B1K7E7YbzeVUJPbU9v62rSQPSr87rCbPkwCg+JRhN20fmXhDtzfHTow
BFVsvHaVt+putNZGntbUraRS
-----END ED25519 PRIVATE KEY-----`;
const testPublicKey = `-----BEGIN ED25519 PUBLIC KEY-----
MCowBQYDK2VwAyEA4lGE3bR+ZeEO3N8dOjAEVWy8dpW36m601kae1tStpFI=
-----END ED25519 PUBLIC KEY-----`;

describe('#signedProperties', () => {
  runTestsWithDataAndAgent(processCb => {
    it('assigns the passed properties to a process', () =>
      processCb()
        .sign({ inputs: true })
        .signed.should.deepEqual({ inputs: true }));

    it('assigns the passed properties to a segment', () =>
      processCb()
        .createMap('test')
        .then(s1 =>
          s1.sign({ inputs: true }).signed.should.deepEqual({ inputs: true })
        ));

    it('assigns default properties to sign when called without argument on a segment', () =>
      signedProperties({ meta: { linkHash: 'test' } }).signed.should.deepEqual({
        inputs: true,
        action: true,
        prevLinkHash: true,
        refs: true
      }));

    it('does not enable signing prevLinkHash by default when called on a process', () =>
      signedProperties({}).signed.should.deepEqual({
        inputs: true,
        action: true,
        prevLinkHash: false,
        refs: true
      }));

    it('fails if trying to add a invalid propery to be signed', () =>
      (() => signedProperties({}, { unknown: true })).should.throw(
        'Cannot sign property unknown, it has to be one of inputs,action,prevLinkHash,refs'
      ));
  });
});

describe('#sign', () => {
  const testKey = withKey({}, testPrivateKey).key;

  const testData = {
    refs: [{ test: 'test' }],
    action: 'test',
    prevLinkHash: 'test',
    inputs: ['1', '2']
  };

  it('outputs a signature given a key and data to sign', () =>
    sign(testKey, testData).then(sig => {
      sig.payload.should.be.exactly(
        '[meta.refs[*].linkHash,meta.action,meta.prevLinkHash,meta.inputs]'
      );
      sig.publicKey.should.be.exactly(testPublicKey);
    }));

  it('build the payload accordingly to the provided data', () =>
    sign(testKey, { ...testData, inputs: false }).then(sig =>
      sig.payload.should.be.exactly(
        '[meta.refs[*].linkHash,meta.action,meta.prevLinkHash]'
      )
    ));

  it('outputs a valid signature', () =>
    sign(testKey, { ...testData, inputs: false }).then(sig => {
      const { signature, publicKey, type } = sig;
      type.should.be.exactly(signatureAlgorithms[testKey.type]);
      const publicKeyBytes = decodePKFromPEM(publicKey).publicKey;
      const signatureBytes = decodeSignatureFromPEM(signature).signature;
      const payloadBytes = Buffer.from(
        stringify([
          testData.refs.map(r => r.linkHash).filter(Boolean),
          testData.action,
          testData.prevLinkHash
        ])
      );
      const verif = nacl.detached.verify(
        payloadBytes,
        signatureBytes,
        publicKeyBytes
      );
      verif.should.be.true();
    }));

  it('fails if the provided data does not match [inputs, action, refs, prevLinkHash]', () =>
    sign(testKey, { ...testData, unknown: 'test' })
      .then(() => {
        throw new Error('should have failed');
      })
      .catch(err =>
        err.message.should.be.exactly(
          'Cannot sign property unknown, it has to be one of inputs,action,prevLinkHash,refs'
        )
      ));

  it('fails the provided data to sign is null', () =>
    sign(testKey, null)
      .then(() => {
        throw new Error('should have failed');
      })
      .catch(err =>
        err.message.should.be.exactly('trying to sign an emtpy payload')
      ));

  it('fails the provided data to sign is empty', () =>
    sign(testKey, {})
      .then(() => {
        throw new Error('should have failed');
      })
      .catch(err =>
        err.message.should.be.exactly(
          'jmespath query [] did not match any data'
        )
      ));

  it('fails when the key is ill-formatted ', () =>
    sign({ type: 'ed25519' }, testData)
      .then(() => {
        throw new Error('should have failed');
      })
      .catch(err =>
        err.message.should.be.exactly(
          'key is not defined (use: segment.withKey(key)'
        )
      ));

  it('fails when the key type does not match any signature algorithm ', () =>
    sign({ ...testKey, ...{ type: 'unknown' } }, testData)
      .then(() => {
        throw new Error('should have failed');
      })
      .catch(err =>
        err.message.should.be.exactly(
          'signing is not supported for this type of key [unknown]'
        )
      ));
});
