/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/**
 * Makes a query string.
 * @param {object} obj - an object of keys
 * @returns {string} a query string
 */
export default function makeQueryString(obj) {
  const parts = Object.keys(obj).reduce((curr, key) => {
    const val = Array.isArray(obj[key]) ? obj[key].join('+') : obj[key];
    curr.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
    return curr;
  }, []);

  if (parts.length) {
    return `?${parts.join('&')}`;
  }

  return '';
}
