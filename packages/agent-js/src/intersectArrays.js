/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/**
 * Compute the intersection between an arbitrary number of arrays.
 * @param {array} arrays an array of arrays
 */
export default function intersectArrays(arrays) {
  if (arrays.length === 0) {
    return [];
  }
  const set = new Set(arrays.shift());

  return Array.from(arrays.reduce((res, array) =>
    new Set(array.filter(v => res.has(v)))
  , set));
}
