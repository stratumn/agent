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

import { promiseWhile } from '@indigocore/utils';
import segmentify from './segmentify';

const DEFAULT_BATCH_SIZE = 20;

export default function findSegments(adaptor, process, opts = {}) {
  if (opts.limit === -1) {
    const { batchSize = DEFAULT_BATCH_SIZE, ...restOpts } = opts;
    const firstArg = {
      offset: 0,
      hasMore: true
    };
    const results = [];

    const condition = ({ hasMore }) => hasMore;
    const findSegmentsChunk = arg => {
      const options = { ...restOpts, offset: arg.offset, limit: batchSize };
      return findSegments(
        adaptor,
        process,
        options
      ).then(({ segments, ...rest }) => {
        results.push(...segments);
        return rest;
      });
    };

    return promiseWhile(
      condition,
      findSegmentsChunk,
      firstArg
    ).then(({ offset, hasMore }) => ({ segments: results, offset, hasMore }));
  }
  return adaptor
    .findSegments(process.name, opts)
    .then(({ body: { segments, ...rest } }) => ({
      segments: segments.map(obj => segmentify(adaptor, process, obj)),
      ...rest
    }));
}
