/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/**
 * Handles an HTTP response from a store or fossilizer.
 * If there is an error and the response has an error, it will reject
 * with an appropriate error. Otherwise it resolves with the response
 * body.
 * @param {Error} err - an error
 * @param {http.Response} res - an HTTP response
 * @returns {Promise} a promise that resolve with the response body
 */
export default function handleResponse(err, res) {
  return new Promise((resolve, reject) => {
    let error = err;
    if (res && res.body && res.body.error) {
      error = new Error(res.body.error);
    }

    if (error) {
      error.status = res ? res.statusCode : 500;
      reject(error);
    } else {
      resolve(res.body);
    }
  });
}
