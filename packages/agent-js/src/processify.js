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

import protoChain from './protoChain';

const loadSignatures = signatures => {
  if (signatures == null) return [];
  if (!Array.isArray(signatures)) {
    throw new Error('Bad signatures type');
  }

  signatures.forEach(sig => {
    if (!sig.type || !sig.publicKey || !sig.signature || !sig.payload) {
      throw new Error(`missing type, public key, signature or payload`);
    }
  });
  return signatures;
};

const loadRefs = refs => {
  if (refs == null) return [];
  if (!Array.isArray(refs)) {
    throw new Error('Bad references type');
  }

  refs.forEach(ref => {
    if ((!ref.process || !ref.linkHash) && ref.segment == null) {
      throw new Error(`missing segment or (process and linkHash)`);
    }
  });
  return refs;
};

const loadMeta = (inputMeta, refs) => ({
  ...(inputMeta || {}),
  refs: loadRefs(refs)
});

export default function processify(
  actions,
  initialLink,
  signatures,
  refs,
  getSegment
) {
  let link = { ...(initialLink || {}) };

  const methods = protoChain(
    {
      init(state) {
        this.append(state);
      }
    },
    actions
  );

  const process = {};

  const promisify = action => (...args) =>
    new Promise((resolve, reject) => {
      const ctx = {
        state: { ...(link.state || {}) },
        meta: loadMeta(link.meta, refs),
        signatures: loadSignatures(signatures),
        append(state, meta) {
          link = {
            state: state || this.state,
            meta: { ...(meta || this.meta) },
            signatures: this.signatures
          };
          resolve(link);
        },
        reject(error) {
          const err = error || this.error;
          reject(
            err instanceof Error ? err : new Error(err || 'An error occurred')
          );
        },
        loadSegment(ref) {
          return getSegment(ref.process, ref.linkHash);
        }
      };

      methods[action].apply(ctx, args);
    });

  // Promisify all methods
  /* eslint-disable */
  for (const key in methods) {
    if (typeof methods[key] === 'function' && !Object.hasOwnProperty(key)) {
      process[key] = promisify(key);
    }
  }
  /* eslint-enable */

  // Add event functions.
  if (typeof actions.events === 'object') {
    process.events = {};

    // Events cannot append or reject.
    const ctx = {
      state: { ...(link.state || {}) },
      meta: { ...(link.meta || {}) }
    };

    Object.keys(actions.events).forEach(key => {
      if (
        typeof actions.events[key] === 'function' &&
        !Object.prototype.hasOwnProperty.call(process.events, key)
      ) {
        process.events[key] = actions.events[key].bind(ctx);
      }
    });
  }

  return process;
}
