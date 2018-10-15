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

import hashJson from '../hashJson';

/**
 * Creates a plugin that encrypts the state before it is saved.
 * @param {object} scheme - The encryption scheme
 * @param {function} scheme.encryptState - A function that takes a link as input and returns either:
 * - the encrypted state
 * - a Promise that resolves with the encrypted state
 * @param {function} scheme.decryptState - A function that takes a link and the expected
 * fingerprint of the decrypted state and returns either:
 * - the decrypted state
 * - a Promise that resolves with the decrypted state
 * @returns {object} an agent plugin
 */
export default function({ encryptState, decryptState }) {
  return {
    name: 'Encrypted State',

    description:
      'Encrypts the state before the segment is saved. ' +
      'Filters out segment that cannot be decrypted.',

    didCreateLink(link) {
      link.meta.data = {
        ...link.meta.data,
        stateHash: hashJson(link.state)
      };
      return Promise.resolve(encryptState(link)).then(state => {
        link.state = {
          encrypted: state
        };
        link.meta.data.encryptedState = true;
      });
    },

    willCreate(initialLink) {
      return this.decrypt(initialLink).then(decrypted => {
        if (!decrypted) {
          throw new Error(
            `State could not be decrypted from link ${initialLink}`
          );
        }
        delete initialLink.meta.data.stateHash;
      });
    },

    filterSegment(segment) {
      return this.decrypt(segment.link);
    },

    decrypt(link) {
      const expectedFingerpint = link.meta.data.stateHash;
      return Promise.resolve(
        decryptState(link, expectedFingerpint)
      ).then(decryptedState => {
        if (decryptedState && expectedFingerpint === hashJson(decryptedState)) {
          link.state = decryptedState;
          delete link.meta.data.encryptedState;
          return true;
        }
        return false;
      });
    }
  };
}
