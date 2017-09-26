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

export default function processify(process) {
  const updatedProcess = process;
  if (this.url) {
    updatedProcess.agentUrl = this.url;
    updatedProcess.prefixUrl = `${this.url}/${process.name}`;
  }
  updatedProcess.createMap = createMap.bind(this, updatedProcess);
  updatedProcess.getSegment = getSegment.bind(this, updatedProcess);
  updatedProcess.findSegments = findSegments.bind(this, updatedProcess);
  updatedProcess.getMapIds = getMapIds.bind(this, updatedProcess);

  // Deprecated.
  updatedProcess.getBranches = getBranches.bind(this, updatedProcess);
  updatedProcess.getLink = getLink.bind(this, updatedProcess);
  updatedProcess.getMap = getMap.bind(this, updatedProcess);

  return updatedProcess;
}
