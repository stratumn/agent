/*
  Copyright 2018 Stratumn SAS. All rights reserved.

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
