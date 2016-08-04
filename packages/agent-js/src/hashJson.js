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
