/*
  Copyright 2016-2018 Stratumn SAS. All rights reserved.

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
// eslint-disable-next-line import/extensions
import { stringify } from 'canonicaljson/lib/canonicaljson.js';
import { search } from 'jmespath';

import { encodeSignatureToPEM } from './encoding';

const attributesMap = {
  inputs: 'meta.inputs',
  action: 'meta.action',
  prevLinkHash: 'meta.prevLinkHash',
  refs: 'meta.refs[*].linkHash'
};

// We need to define which signature algorithm is used for a kind of private key.
// This is used by the backend to verify the signature.
export const signatureAlgorithms = {
  'ED25519 PRIVATE KEY': 'ED25519',
  'EC PRIVATE KEY': 'ECDSA-SHA256',
  'RSA PRIVATE KEY': 'SHA256-RSA'
};

/**
 * Defines the object properties to be signed.
 * Each property maps to a boolean saying wether or not it should be signed.
 * @param {object} obj - a segment (or a process in case of a new map) to be signed.
 * @param {object} properties - a segment (or a process in case of a new map) to be signed.
 * @param {bool} [properties.action] - name of the action the user is calling.
 * @param {bool} [properties.inputs] - user-defined inputs (action arguments).
 * @param {bool} [properties.prevLinkHash] - previous link hash of a segment.
 * @param {bool} [properties.refs] - references of a segment.
 * @returns {object} the provided object extended with the attributes to sign.
 */
export const signedProperties = (obj, properties) => {
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
      action: true,
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
 * @param {string} key.type - the private key type (eg: ED25519 PRIVATE KEY)
 * @param {string} key.public - the PEM-encoded encoded public key
 * @param {Buffer} key.secret - a Buffer (or Uint8Array) containing the private key
 * @param {object} data - an object containing the properties to sign.
 * @param {string[]} [data.inputs] - user-defined inputs (action arguments).
 * @param {string} [data.action] - name of the action the user is calling.
 * @param {string} [data.prevLinkHash] - previous link hash of a segment.
 * @param {object[]} [data.refs] - references of a segment.
 * @returns {object} a signature
 */
export const sign = (key, data) =>
  new Promise((resolve, reject) => {
    if (!data) {
      reject(new Error('trying to sign an emtpy payload'));
    }

    if (!key || !key.secret || !key.type) {
      reject(new Error('key is not defined (use: segment.withKey(key)'));
    }

    const signatureAlgorithm = signatureAlgorithms[key.type];
    if (!signatureAlgorithm) {
      reject(
        new Error(`signing is not supported for this type of key [${key.type}]`)
      );
    }
    // define what will be signed
    const payload = buildPayloadPath(data);

    // extract payload from a (simulated) link
    // remove null/undefined elements from the result of the JMESPATH query
    const payloadData = (search({ meta: data }, payload) || []).filter(Boolean);
    if (!payloadData || payloadData.length === 0) {
      reject(new Error(`jmespath query ${payload} did not match any data`));
    }

    // serialize payload using canonicaljson
    const payloadBytes = Buffer.from(stringify(payloadData));

    // sign the payload and resolve with the signature
    const signature = Buffer.from(naclSign.detached(payloadBytes, key.secret));

    resolve({
      type: signatureAlgorithm,
      publicKey: key.public,
      signature: encodeSignatureToPEM(signature),
      payload: payload
    });
  });
