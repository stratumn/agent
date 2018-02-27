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

const handledKeyFormats = ['ed25519'];

function isSchemeHandled(alg) {
  return handledKeyFormats.includes(alg.toLowerCase());
}

/** 
* checks if the key is well formatted and that the signature scheme is handled
* @param {object} key - a key object
* @param {string} key.type - the signature scheme that should be used with this key (eg: ed25519)
* @param {string} key.secret - the base64-encoded private key (64 bytes long)
*/
export function validateKey(key) {
  if (!key || !key.type || !key.secret) {
    throw new Error(
      "key object must comply to the format : {type: 'ed25519', secret: 'YOURSECRETKEY'}"
    );
  }

  if (!isSchemeHandled(key.type)) {
    throw new Error(`${key.type} : Unhandled key type`);
  }

  const secretKeyBytes = Buffer.from(key.secret, 'base64');
  if (secretKeyBytes.length !== nacl.secretKeyLength) {
    throw new Error(
      `secret key length must be ${nacl.secretKeyLength}, got ${secretKeyBytes.length}`
    );
  }
  return true;
}

/** 
 *
* @param {object} key - a key object
* @param {string} key.type - the signature scheme that should be used with this key (eg: ed25519)
* @param {string} key.secret - the base64-encoded private key (64 bytes long)
*/
export const parseKey = key => ({
  ...key,
  secret: Buffer.from(key.secret, 'base64'),
  public: Buffer.from(key.secret, 'base64')
    .slice(nacl.publicKeyLength)
    .toString('base64')
});

/**
 * Attach a key to a process or a segment.
* @param {object} obj - either a process or a segment
* @param {object} key - a key object
* @param {string} key.type - the signature scheme that should be used with this key (eg: ed25519)
* @param {string} key.secret - the base64-encoded private key (64 bytes long)
 * @returns {object} the updated process or segment with a key
 */
export function withKey(obj, key) {
  validateKey(key);
  return Object.assign(obj, {
    key: parseKey(key)
  });
}
