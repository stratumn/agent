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
