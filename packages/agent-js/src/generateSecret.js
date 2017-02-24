/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import crypto from 'crypto';

/**
 * Generates a secret from a link hash and salt.
 * @param {string} linkHash - the link hash
 * @param {string} salt - the salt
 * @returns {string} the secret
 */
export default function generateSecret(linkHash, salt) {
  return crypto
    .createHash('sha256')
    .update(`${salt}:${linkHash}`)
    .digest('hex');
}
