/*
    Stratumn Agent Javascript Library
    Copyright (C) 2016  Stratumn SAS

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
