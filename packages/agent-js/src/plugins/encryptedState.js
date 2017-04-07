/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
export default function ({ encryptState, decryptState }) {
  return {

    name: 'Encrypted State',

    description: 'Encrypts the state before the segment is saved. ' +
      'Filters out segment that cannot be decrypted.',

    didCreateLink(link) {
      link.meta.stateHash = hashJson(link.state);
      return Promise.resolve(encryptState(link))
        .then(state => {
          link.state = state;
          link.meta.encryptedState = true;
        });
    },

    willCreate(initialLink) {
      const decrypted = this.decrypt(initialLink);
      if (!decrypted) {
        throw new Error(`State could not be decrypted from link ${initialLink}`);
      }
      delete initialLink.meta.stateHash;
    },

    filterSegment(segment) {
      return this.decrypt(segment.link);
    },

    decrypt(link) {
      const expectedFingerpint = link.meta.stateHash;
      return Promise.resolve(decryptState(link, expectedFingerpint))
        .then(decryptedState => {
          if (decryptedState && expectedFingerpint === hashJson(decryptedState)) {
            link.state = decryptedState;
            delete link.meta.encryptedState;
            return true;
          }
          return false;
        });
    }
  };
}
