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

import { stringify } from 'qs';

/**
 * Makes a query string.
 * @param {object} obj - an object of keys
 * @returns {string} a query string
 */
export default function makeQueryString(obj) {
  // use brackets format for compatibility with GO:
  // https://github.com/google/go-querystring
  // see also conversation in:
  // https://github.com/stratumn/indigo-js/pull/18
  const query = stringify(obj, { arrayFormat: 'brackets' });
  if (query.length) {
    return `?${query}`;
  }
  return '';
}
