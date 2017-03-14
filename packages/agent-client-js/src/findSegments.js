/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
