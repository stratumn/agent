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

import segmentify from './segmentify';
import promiseWhile from './promiseWhile';

const DEFAULT_BATCH_SIZE = 20;

export default function findSegments(process, opts = {}) {
  const options = Object.assign({}, opts);
  if (opts.limit === -1) {
    options.limit = options.batchSize || DEFAULT_BATCH_SIZE;
    delete options.batchSize;
    options.offset = 0;
    let lastBatch = [];
    const result = [];

    return promiseWhile(
      () => lastBatch.length === options.limit,
      () => findSegments.call(this, process, options)
        .then(newSegments => {
          lastBatch = newSegments;
          result.push(...newSegments);
          options.offset += options.limit;
        })
    ).then(() => result);
  }
  return this.findSegments(process.name, opts)
    .then(res => res.body.map(obj => segmentify.call(this, process, obj)));
}
