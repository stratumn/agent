/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import getSegment from './getSegment';
import deprecated from './deprecated';

export default function getLink(agent, hash) {
  deprecated('Agent#getLink(agent, hash)', 'Agent#getSegment(agent, hash)');

  return getSegment(agent, hash);
}
