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

import {
  decodePEM,
  encodePKToPEM,
  decodePKFromPEM,
  encodeSKToPEM,
  decodeSKFromPEM,
  encodeSignatureToPEM,
  decodeSignatureFromPEM
} from '../src/encoding';

const randomBuffer = length =>
  Buffer.from(
    new Uint8Array(length).map(() => Math.random() * Math.floor(255))
  );

describe('#encodePEM', () => {});

describe('#decodePEM', () => {});

describe('#encodePKToPEM', () => {
  const keyType = 'ED25519 PUBLIC KEY';
  const fakePK = randomBuffer(nacl.publicKeyLength);
  it('encodes a byte array to a PEM string containing the ASN.1 representation of a public key', () => {
    const PKInfo = encodePKToPEM(fakePK, keyType);
    decodePEM(PKInfo, keyType).should.not.throw();
    decodePKFromPEM(PKInfo, keyType).should.deepEqual({
      publicKey: fakePK,
      type: keyType
    });
  });

  it('handles bad key types', () =>
    (() => encodePKToPEM(fakePK, 'bad')).should.throw(
      'Could not encode public key: unknown public key algorithm'
    ));

  it('handles bad key format', () =>
    (() => encodePKToPEM({}, keyType)).should.throw(
      'Could not encode public key: Unsupported type: object at: ["publicKey"]'
    ));
});

describe('#decodePKFromPEM', () => {
  const testPEMPublicKey = `-----BEGIN ED25519 PUBLIC KEY-----
MCowBQYDK2VwAyEA4lGE3bR+ZeEO3N8dOjAEVWy8dpW36m601kae1tStpFI=
-----END ED25519 PUBLIC KEY-----`;

  it('decodes a PEM string containing the ASN.1 representation of a public key to a byte array', () => {
    const { publicKey, type } = decodePKFromPEM(testPEMPublicKey);
    publicKey.length.should.be.exactly(nacl.publicKeyLength);
    encodePKToPEM(publicKey, type).should.be.exactly(testPEMPublicKey);
  });

  it('handles bad key types', () =>
    (() =>
      decodePKFromPEM(testPEMPublicKey.replace('ED25519', 'BAD'))).should.throw(
      'Missing PEM label, or mismatch between BEGIN and END labels'
    ));

  it('handles bad key format', () =>
    (() => decodePKFromPEM({})).should.throw());
});

describe('#encodeSKToPEM', () => {
  const keyType = 'ED25519 PUBLIC KEY';
  const fakeSK = randomBuffer(nacl.secretKeyLength);
  it('encodes a byte array to a PEM string containing the ASN.1 representation of a secret key', () => {
    const SKInfo = encodeSKToPEM(fakeSK, keyType);
    decodePEM(SKInfo, { tag: keyType }).should.not.throw();
    decodeSKFromPEM(SKInfo, keyType).should.deepEqual({
      secretKey: fakeSK,
      type: keyType
    });
  });

  it('handles bad key types', () =>
    (() => encodePKToPEM(fakeSK, 'bad')).should.throw(
      'Could not encode public key: unknown public key algorithm'
    ));

  it('handles bad key format', () =>
    (() => encodePKToPEM({}, keyType)).should.throw());
});

describe('#decodeSKFromPEM', () => {
  const testPEMPrivateKey = `-----BEGIN ED25519 PRIVATE KEY-----
BEAu3UcG9B1K7E7YbzeVUJPbU9v62rSQPSr87rCbPkwCg+JRhN20fmXhDtzfHTow
BFVsvHaVt+putNZGntbUraRS
-----END ED25519 PRIVATE KEY-----`;
  it('decodes a PEM string containing the ASN.1 representation of a public key to a byte array', () => {
    const { secretKey, type } = decodeSKFromPEM(testPEMPrivateKey);
    secretKey.length.should.be.exactly(nacl.secretKeyLength);
    encodeSKToPEM(secretKey, type).should.be.exactly(testPEMPrivateKey);
  });

  it('handles bad key types', () =>
    (() =>
      decodeSKFromPEM(
        testPEMPrivateKey.replace('ED25519', 'BAD')
      )).should.throw(
      'Missing PEM label, or mismatch between BEGIN and END labels'
    ));

  it('handles bad key format', () =>
    (() => decodeSKFromPEM({})).should.throw());
});

describe('#encodeSignatureToPEM', () => {
  const tag = 'MESSAGE';
  const fakeSig = randomBuffer(nacl.signatureLength);
  it('encodes a byte array to a PEM string containing the ASN.1 representation of a signed signature', () => {
    const PEMSig = encodeSignatureToPEM(fakeSig, tag);
    decodePEM(PEMSig, { tag }).should.not.throw();
    decodeSignatureFromPEM(PEMSig).signature.should.deepEqual(fakeSig);
  });

  it('handles bad signature format', () =>
    (() => encodeSignatureToPEM({})).should.throw());
});

describe('#decodeSignatureFromPEM', () => {
  const testPEMSignature = `-----BEGIN MESSAGE-----
BEDZR29+Zk8M72ZlgWstb3o96MdKNXeT0Q7LfzDFQKjv9dLjeHpRL4BSjkjPWbuA
Kmq1nHIk7T7bpLBohyy0lRYO
-----END MESSAGE-----`;
  it('decodes o a PEM string containing the ASN.1 representation of a signed message to a byte array', () => {
    const { signature, type } = decodeSignatureFromPEM(testPEMSignature);
    signature.length.should.be.exactly(nacl.signatureLength);
    encodeSignatureToPEM(signature, type).should.be.exactly(testPEMSignature);
  });

  it('handles bad signature format', () =>
    (() => decodeSignatureFromPEM(null)).should.throw());
});
