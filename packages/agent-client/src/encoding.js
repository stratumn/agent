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

import { define } from 'asn1.js';

export const publicKeyOIDs = {
  'ED25519 PUBLIC KEY': [1, 3, 101, 112],
  'RSA PUBLIC KEY': [1, 2, 840, 113549, 1, 1, 1],
  'EC PUBLIC KEY': [1, 2, 840, 10045, 2, 1]
};

// ASN.1 ED25519 SECRET KEY ENCODER
function Asn1ED25519SecretKey() {
  this.octstr();
}
const Ed25519SecretKeyEncoder = define(
  'Asn1ED25519SecretKey',
  Asn1ED25519SecretKey
);

// ASN.1 PUBLIC KEY ENCODER
function Asn1AlgorithmIdentifier() {
  this.seq().obj(
    this.key('algorithm').objid(),
    this.key('parameters')
      .optional()
      .any()
  );
}
const AlgorithmIdentifierEncoder = define(
  'AlgorithmIdentifier',
  Asn1AlgorithmIdentifier
);

function Asn1PublicKey() {
  this.seq().obj(
    this.key('algorithm').use(AlgorithmIdentifierEncoder),
    this.key('publicKey').bitstr()
  );
}
const PublicKeyEncoder = define('Asn1PublicKey', Asn1PublicKey);

// API

export function encodePEM(data, label) {
  if (!label) {
    throw new Error('PEM encoding failed: missing label');
  }

  const p = data.toString('base64');
  const out = [`-----BEGIN ${label}-----`];
  for (let i = 0; i < p.length; i += 64) out.push(p.slice(i, i + 64));
  out.push(`-----END ${label}-----`);
  return out.join('\n');
}

export function decodePEM(data) {
  if (typeof data !== 'string') {
    throw new Error('PEM data must be a string');
  }
  const lines = data.split(/\r?\n/).filter(Boolean);
  if (lines.length < 3) {
    throw new Error('string is not PEM encoded');
  }
  const beginRE = new RegExp(`-----\\s*BEGIN (.*)\\s*-----`);
  const endRE = new RegExp(`-----\\s*END (.*)\\s*-----`);
  const tagBegin = lines[0].match(beginRE);
  const tagEnd = lines[lines.length - 1].match(endRE);
  if (!tagBegin || !tagEnd || !tagBegin[1]) {
    throw new Error('Missing PEM label');
  } else if (tagBegin[1] !== tagEnd[1]) {
    throw new Error('Mismatch between BEGIN and END labels');
  }
  return {
    body: Buffer.from(lines.slice(1, lines.length - 1).join(''), 'base64'),
    label: tagBegin[1]
  };
}

export function encodePKToPEM(publicKey, keyType) {
  let ASN1Bytes;
  try {
    const algorithm = publicKeyOIDs[keyType];
    if (!algorithm) {
      throw new Error('unknown public key algorithm');
    }
    ASN1Bytes = PublicKeyEncoder.encode(
      {
        algorithm: { algorithm },
        publicKey: { data: publicKey }
      },
      'der'
    );
  } catch (e) {
    throw new Error(`Could not encode public key: ${e.message}`);
  }
  return encodePEM(ASN1Bytes, keyType);
}

export function decodePKFromPEM(key) {
  const ASN1Bytes = decodePEM(key);
  let publicKeyInfo;
  try {
    publicKeyInfo = PublicKeyEncoder.decode(ASN1Bytes.body, 'der');
  } catch (e) {
    throw new Error(`Could not decode public key: ${e.message}`);
  }
  return {
    publicKey: publicKeyInfo.publicKey.data,
    type: ASN1Bytes.label
  };
}

export function encodeSKToPEM(key, keyType) {
  let ASN1Bytes;
  try {
    ASN1Bytes = Ed25519SecretKeyEncoder.encode(key, 'der');
  } catch (e) {
    throw new Error(`Could not encode public key: ${e.message}`);
  }
  return encodePEM(ASN1Bytes, keyType);
}

export function decodeSKFromPEM(key) {
  const ASN1Bytes = decodePEM(key);
  let secretKeyBytes;
  try {
    secretKeyBytes = Ed25519SecretKeyEncoder.decode(ASN1Bytes.body, 'der');
  } catch (e) {
    throw new Error(`Could not decode secret key: ${e.message}`);
  }
  return {
    secretKey: secretKeyBytes,
    type: ASN1Bytes.label
  };
}

export function encodeSignatureToPEM(signature) {
  return encodePEM(signature, 'MESSAGE');
}

export function decodeSignatureFromPEM(signature) {
  const { body, label } = decodePEM(signature);
  return {
    signature: body,
    type: label
  };
}
