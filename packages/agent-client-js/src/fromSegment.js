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

import getAgent from './getAgent';
import segmentify from './segmentify';

export default function fromSegment(obj) {
  return getAgent(obj.meta.agentUrl || obj.meta.applicationLocation)
    .then(agent => {
      if (!agent.processes[obj.link.meta.process]) {
        throw new Error(`process '${obj.link.meta.process}' not found`);
      }
      const segment = segmentify(agent.processes[obj.link.meta.process], obj);
      return { process: agent.processes[obj.link.meta.process], segment };
    });
}
