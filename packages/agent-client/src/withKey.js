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

import { sign as nacl } from 'tweetnacl';

import { decodeSKFromPEM, encodePKToPEM } from './encoding';

const handledKeyFormats = ['ED25519 PRIVATE KEY'];

/** 
* checks if the key is well formatted and that the signature scheme is handled
* @param {string} key - a PEM encoded string labeled with the type of the key and containing the DER serialization of the secret key
 * @returns {string} the type of the key
*/
export function validateKey(key) {
  if (!key) {
    throw new Error('key object must comply to the PEM format');
  }

  const { secretKey, type } = decodeSKFromPEM(key);
  if (secretKey.length !== nacl.secretKeyLength) {
    throw new Error(
      `secret key length must be ${nacl.secretKeyLength}, got ${secretKey.length}`
    );
  }
  if (!handledKeyFormats.includes(type)) {
    throw new Error('Could not parse key: unhandled key type');
  }
}

/** 
 *
* @param {string} key - a PEM encoded string labeled with the type of the key and containing the DER serialization of the key
*/
export const parseKey = key => {
  validateKey(key);

  const { secretKey, type } = decodeSKFromPEM(key);
  const rawPublicKey = secretKey.slice(nacl.publicKeyLength);
  const publicKeyType = type.replace('PRIVATE', 'PUBLIC');

  return {
    type,
    secret: secretKey,
    public: encodePKToPEM(rawPublicKey, publicKeyType)
  };
};
/**
 * Attach a key to a process or a segment.
* @param {object} obj - either a process or a segment
* @param {object} key - a PEM encoded key
 * @returns {object} the updated process or segment with a key
 */
export function withKey(obj, key) {
  return Object.assign(obj, {
    key: parseKey(key)
  });
}
