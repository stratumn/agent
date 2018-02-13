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

import { sign as naclSign } from 'tweetnacl';
import { stringify } from 'canonicaljson';
import { search } from 'jmespath';

const attributesMap = {
  inputs: 'meta.inputs',
  prevLinkHash: 'meta.prevLinkHash',
  refs: 'meta.refs'
};

/**
 * Defines the object properties to be signed.
 * Each property maps to a boolean saying wether or not it should be signed.
 * @param {object} obj - a segment (or a process in case of a new map) to be signed.
 * @param {object} data - a segment (or a process in case of a new map) to be signed.
 * @param {bool} [data.inputs] - user-defined inputs (action arguments).
 * @param {bool} [data.prevLinkHash] - previous link hash of a segment.
 * @param {bool} [data.refs] - references of a segment.
 * @returns {object} the provided object extended with the attributes to sign.
 */
const signedProperties = (obj, properties) => {
  if (properties) {
    Object.keys(properties).forEach(p => {
      if (!attributesMap[p]) {
        throw new Error(
          `Cannot sign property ${p}, it has to be one of ${Object.keys(
            attributesMap
          )}`
        );
      }
    });
  }
  return Object.assign(obj, {
    signed: properties || {
      inputs: true,
      prevLinkHash: obj.meta ? !!obj.meta.linkHash : false,
      refs: true
    }
  });
};

const buildPayloadPath = properties => {
  const propertiesToSign = Object.keys(properties).filter(p => properties[p]);
  const linkAttributesToSign = Array.from(propertiesToSign, attr => {
    if (!attributesMap[attr]) {
      throw new Error(
        `Cannot sign property ${attr}, it has to be one of ${Object.keys(
          attributesMap
        )}`
      );
    }
    return attributesMap[attr];
  });
  return `[${linkAttributesToSign.toString()}]`;
};

/**
 * Signs a payload
 * @param {object} key - a key object
 * @param {string} key.type - the signature scheme that should be used with this key (eg: ed25519)
 * @param {string} key.public - the base64 encoded public key
 * @param {Buffer} key.secret - a Buffer (or Uint8Array) containing the private key
 * @param {object} data - an object containing the properties to sign.
 * @param {bool} [data.inputs] - user-defined inputs (action arguments).
 * @param {bool} [data.prevLinkHash] - previous link hash of a segment.
 * @param {bool} [data.refs] - references of a segment.
 * @returns {object} a signature
 */
const sign = (key, data) =>
  new Promise((resolve, reject) => {
    if (!data) {
      reject(new Error('trying to sign an emtpy payload'));
    }

    if (!key || !key.secret || !key.type) {
      reject(new Error('key is not defined (use: segment.withKey(key)'));
    }

    // define what will be signed
    const payloadPath = buildPayloadPath(data);

    // extract payload from a (simulated) link
    // remove null/undefined elements from the result of the JMESPATH query
    const payload = (search({ meta: data }, payloadPath) || []).filter(Boolean);
    if (!payload || payload.length === 0) {
      reject(new Error(`jmespath query ${payloadPath} did not match any data`));
    }

    // serialize payload using canonicaljson
    const payloadBytes = Buffer.from(stringify(payload));

    // sign the payload and resolve with the signature
    const signature = naclSign.detached(payloadBytes, key.secret);

    resolve({
      type: key.type,
      publicKey: key.public,
      signature: Buffer.from(signature).toString('base64'),
      payload: payloadPath
    });
  });

export { sign, signedProperties };
