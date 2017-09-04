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

import getProcesses from './getProcesses';
import processify from './processify';
import { get } from './request';

export default function getAgent(url) {
  return get(url)
    .then(res => {
      const agent = res.body;
      agent.url = url;
      agent.getProcesses = getProcesses.bind(null, agent);
      agent.processes = Object.values(agent.processes).reduce((map, p) => {
        const updatedMap = map;
        updatedMap[p.name] = processify(p, agent.url);
        return updatedMap;
      }, {});
      return agent;
    });
}
