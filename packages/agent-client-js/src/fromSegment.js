/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import getAgent from './getAgent';
import segmentify from './segmentify';

export default function fromSegment(obj) {
  return getAgent(obj.meta.agentUrl || obj.meta.applicationLocation)
    .then(agent => {
      const segment = segmentify(agent, obj);
      return { agent, segment };
    });
}
