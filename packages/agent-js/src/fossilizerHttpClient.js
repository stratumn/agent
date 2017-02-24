/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import request from 'superagent';
import handleResponse from './handleResponse';

/**
 * Creates a fossilizer HTTP client.
 * @param {string} url - the base URL of the fossilizer
 * @param {object} [opts] - options
 * @param {function} [opts.callbackUrl] - builds a URL that will be called with the evidence
 * @returns {Client} a fossilizer HTTP client
 */
export default function fossilizerHttpClient(url, opts = {}) {
  return {
    /**
     * Gets information about the fossilizer.
     * @returns {Promise} a promise that resolve with the information
     */
    getInfo() {
      return new Promise((resolve, reject) => {
        request
          .get(`${url}/`)
          .end((err, res) => handleResponse(err, res).then(resolve).catch(reject));
      });
    },

    /**
     * Fossilizes data.
     * @param {Buffer} data - the data to fossilize
     * @param {string} callback URL - a URL that will be called with the evidence
     * @returns {Promise} a promise that resolves with the response body
     */
    fossilize(data, callbackUrl) {
      if (!callbackUrl && opts.callbackUrl) {
        /*eslint-disable*/
        callbackUrl = typeof opts.callbackUrl === 'function'
          ? opts.callbackUrl(data)
          : opts.callbackUrl;
        /*eslint-enable*/
      }

      return new Promise((resolve, reject) => {
        request
          .post(`${url}/fossils`)
          .type('form')
          .send({ data, callbackUrl })
          .end((err, res) => handleResponse(err, res).then(resolve).catch(reject));
      });
    }
  };
}
