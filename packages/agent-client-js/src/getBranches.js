/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import findSegments from './findSegments';
import deprecated from './deprecated';

export default function getBranches(agent, prevLinkHash, tags = []) {
  deprecated(
    'Agent#getBranches(agent, prevLinkHash, tags = [])',
    'Agent#findSegments(agent, filter)'
  );

  return findSegments(agent, { prevLinkHash, tags });
}
