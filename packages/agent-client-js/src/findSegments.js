/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import segmentify from './segmentify';
import makeQueryString from './makeQueryString';
import { get } from './request';

export default function findSegments(agent, opts = {}) {
  return get(`${agent.url}/segments${makeQueryString(opts)}`)
    .then(res => res.body.map(obj => segmentify(agent, obj)));
}
