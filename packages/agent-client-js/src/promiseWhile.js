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
