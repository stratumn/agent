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

import createMap from './createMap';
import getSegment from './getSegment';
import findSegments from './findSegments';
import getMapIds from './getMapIds';
import { get } from './request';

// Deprecated.
import getBranches from './getBranches';
import getLink from './getLink';
import getMap from './getMap';

export default function getAgent(url) {
  return get(url)
    .then(res => {
      const agent = res.body;

      agent.url = url;
      agent.createMap = createMap.bind(null, agent);
      agent.getSegment = getSegment.bind(null, agent);
      agent.findSegments = findSegments.bind(null, agent);
      agent.getMapIds = getMapIds.bind(null, agent);

      // Deprecated.
      agent.getBranches = getBranches.bind(null, agent);
      agent.getLink = getLink.bind(null, agent);
      agent.getMap = getMap.bind(null, agent);

      return agent;
    });
}
