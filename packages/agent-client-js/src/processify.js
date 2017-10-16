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

export default function processify(adaptor, process) {
  const updatedProcess = process;
  if (adaptor.url) {
    updatedProcess.agentUrl = adaptor.url;
    updatedProcess.prefixUrl = `${adaptor.url}/${process.name}`;
  }
  updatedProcess.createMap = createMap.bind(null, adaptor, updatedProcess);
  updatedProcess.getSegment = getSegment.bind(null, adaptor, updatedProcess);
  updatedProcess.findSegments = findSegments.bind(
    null,
    adaptor,
    updatedProcess
  );
  updatedProcess.getMapIds = getMapIds.bind(null, adaptor, updatedProcess);

  return updatedProcess;
}
