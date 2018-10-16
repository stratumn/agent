/*
  Copyright 2016-2018 Stratumn SAS. All rights reserved.

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
import withRefs from './withRefs';
import getSegment from './getSegment';
import findSegments from './findSegments';
import getMapIds from './getMapIds';
import { withKey } from './withKey';
import { signedProperties } from './sign';

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
  updatedProcess.withRefs = withRefs.bind(null, updatedProcess);
  updatedProcess.withKey = withKey.bind(null, updatedProcess);
  updatedProcess.sign = signedProperties.bind(null, updatedProcess);
  return updatedProcess;
}
