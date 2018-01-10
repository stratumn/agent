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

export default function findSegments(adaptor, process, opts = {}) {
  const options = Object.assign({}, opts);
  if (opts.limit === -1) {
    options.limit = options.batchSize || DEFAULT_BATCH_SIZE;
    delete options.batchSize;
    options.offset = 0;
    let keepFetching = true;
    const result = [];

    return promiseWhile(
      () => keepFetching,
      () =>
        findSegments(
          adaptor,
          process,
          options
        ).then(({ segments, hasMore, offset }) => {
          result.push(...segments);
          options.offset = offset;
          keepFetching = hasMore;
        })
    ).then(() => ({
      segments: result,
      hasMore: false,
      offset: options.offset
    }));
  }
  return adaptor
    .findSegments(process.name, opts)
    .then(({ body: { segments, ...rest } }) => ({
      segments: segments.map(obj => segmentify(adaptor, process, obj)),
      ...rest
    }));
}
