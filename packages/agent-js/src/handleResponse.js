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
      error.message = error.response.text
        ? JSON.parse(error.response.text).error
        : error.message;
      reject(error);
    } else {
      resolve(res.body);
    }
  });
}
