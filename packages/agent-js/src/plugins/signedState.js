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

import hashJson from '../hashJson';

/**
 * Creates a plugin that signs the state before it is saved.
 * @param {object} scheme - The signature scheme
 * @param {function} scheme.signState - A function that takes a link and the state hash as input
 * and returns either:
 * - the signed hash
 * - a Promise that resolves with the signed hash
 * @param {function} scheme.verifySignature - A function that takes a link a signature and a hash
 * as input and returns either:
 * - a boolean that states wether the signature has been verified
 * - a Promise that resolves with such a boolean
 * @returns {object} an agent plugin
 */
export default function({ signState, verifySignature }) {
  return {
    name: 'Signed State',

    description:
      'Signs the state before the segment is saved.' +
      'Filters out segments whose signature is invalid.',

    didCreateLink(link) {
      link.meta.stateHash = hashJson(link.state);
      Promise.resolve(signState(link, link.meta.stateHash)).then(signature => {
        link.meta.stateSignature = signature;
      });
    },

    filterSegment(segment) {
      return Promise.resolve(
        verifySignature(
          segment,
          segment.link.meta.stateSignature,
          segment.link.meta.stateHash
        )
      );
    }
  };
}
