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

// Deprecated.
import getBranches from './getBranches';
import getLink from './getLink';
import getMap from './getMap';

export default function processify(process, agentUrl) {
  const updatedProcess = process;
  updatedProcess.agentUrl = agentUrl;
  updatedProcess.prefixUrl = `${agentUrl}/${process.name}`;
  updatedProcess.createMap = createMap.bind(null, updatedProcess);
  updatedProcess.getSegment = getSegment.bind(null, updatedProcess);
  updatedProcess.findSegments = findSegments.bind(null, updatedProcess);
  updatedProcess.getMapIds = getMapIds.bind(null, updatedProcess);

  // Deprecated.
  updatedProcess.getBranches = getBranches.bind(null, updatedProcess);
  updatedProcess.getLink = getLink.bind(null, updatedProcess);
  updatedProcess.getMap = getMap.bind(null, updatedProcess);

  return updatedProcess;
}
