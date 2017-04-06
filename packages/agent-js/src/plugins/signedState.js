/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import hashJson from '../hashJson';

/**
 * Creates a plugin that signs the state before it is saved.
 * @param {object} scheme - The signature scheme
 * @param {function} scheme.signState - A function that takes a hash as input and returns either:
 * - the signed hash
 * - a Promise that resolves with the signed hash
 * @param {function} scheme.verifySignature - A function that takes a signature and a hash as input
 * and returns either:
 * - a boolean that states wether the signature has been verified
 * - a Promise that resolves with such a boolean
 * @returns {object} an agent plugin
 */
export default function ({ signState, verifySignature }) {
  return {

    name: 'Signed State',

    description: 'Signs the state before the segment is saved.' +
      'Filters out segments whose signature is invalid.',

    didCreateLink(link) {
      link.meta.stateHash = hashJson(link.state);
      Promise.resolve(signState(link.meta.stateHash))
        .then(signature => {
          link.meta.stateSignature = signature;
        });
    },

    filterSegment(segment) {
      return Promise.resolve(
        verifySignature(segment.link.meta.stateSignature, segment.link.meta.stateHash)
      );
    }
  };
}
