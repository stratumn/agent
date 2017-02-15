/*
    Stratumn Agent Javascript Library
    Copyright (C) 2017  Stratumn SAS

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
