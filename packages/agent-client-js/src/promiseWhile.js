/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import 'setimmediate';

/**
 * Calls a function that returns a Promise until a condition is reached
 * @param {function} condition - while condition is true body will keep being called
 * @param {function} body - a function that is repeatedly called while condition is true
 * @returns {Promise} a Promise that resolves when the condition is no longer true
 */
export default function promiseWhile(condition, body) {
  return new Promise((resolve, reject) => {
    function loop() {
      body()
      .then(() => {
        // When the result of calling `condition` is no longer true, we are
        // done.
        if (!condition()) {
          resolve();
        } else {
          loop();
        }
      })
      .catch(reject);
    }

    // Start running the loop in the next tick so that this function is
    // completely async. It would be unexpected if `body` was called
    // synchronously the first time.
    setImmediate(loop);
  });
}
