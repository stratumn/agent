/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/**
 * Parses function arguments from a request body.
 * @param {object} body - the request body
 * @returns {array} the function arguments
 */
export default function parseArgs(body) {
  if (!body) {
    return [];
  }

  if (Array.isArray(body)) {
    return body;
  }

  if (typeof body !== 'object' || Object.keys(body).length > 0) {
    return [body];
  }

  return [];
}
