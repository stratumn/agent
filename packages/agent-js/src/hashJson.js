/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import crypto from 'crypto';
import stringify from 'canonical-json';

/**
 * Canonically hashes a json object.
 * @param {Object} obj - the json object
 * @returns {Promise} a promise that resolve with the hash.
 */
export default function hashJson(obj) {
  return crypto
    .createHash('sha256')
    .update(stringify(obj))
    .digest('hex');
}
