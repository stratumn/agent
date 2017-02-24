/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

export default function (agentUrl) {
  return {
    name: 'Agent URL',

    description: 'Saves in segment meta the URL that can be used to retrieve a segment',

    didCreateSegment(segment) {
      const meta = segment.meta;
      const linkHash = meta.linkHash;

      meta.agentUrl = agentUrl;
      meta.segmentUrl = `${agentUrl}/segments/${linkHash}`;
    }
  };
}
