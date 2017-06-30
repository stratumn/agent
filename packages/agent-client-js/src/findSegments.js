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
import makeQueryString from './makeQueryString';
import promiseWhile from './promiseWhile';
import { get } from './request';

const DEFAULT_BATCH_SIZE = 20;

export default function findSegments(agent, opts = {}) {
  const options = Object.assign({}, opts);
  if (opts.limit === -1) {
    options.limit = options.batchSize || DEFAULT_BATCH_SIZE;
    delete options.batchSize;
    options.offset = 0;
    const segments = [];

    return promiseWhile(
      () => segments.length === options.limit,
      () => findSegments(agent, options)
              .then(newSegments => {
                segments.push(...newSegments);
                options.offset += options.limit;
              })
    ).then(() => segments);
  }

  return get(`${agent.url}/segments${makeQueryString(opts)}`)
    .then(res => res.body.map(obj => segmentify(agent, obj)));
}
