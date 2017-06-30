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
