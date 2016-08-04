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
    if (res && res.body && res.body.error) {
      /*eslint-disable*/
      err = new Error(res.body.error)
      /*eslint-enable*/
    }

    if (err) {
      /*eslint-disable*/
      err.status = res ? res.statusCode : 500;
      /*eslint-enable*/
      reject(err);
      return;
    }

    resolve(res.body);
  });
}
