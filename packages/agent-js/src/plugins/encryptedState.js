/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import hashJson from '../hashJson';

export default function ({ encryptState, decryptState }) {
  return {

    name: 'Encrypted State',

    description: 'Encrypts the state before the segment is saved. ' +
      'Filters out segment that cannot be decrypted.',

    didCreateLink(link) {
      link.meta.stateHash = hashJson(link.state);
      link.state = encryptState(link);
      link.meta.encryptedState = true;
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
      const decryptedState = decryptState(link, expectedFingerpint);

      if (decryptedState && expectedFingerpint === hashJson(decryptedState)) {
        link.state = decryptedState;
        delete link.meta.encryptedState;
        return true;
      }
      return false;
    }
  };
}
