/*
  Copyright 2018 Stratumn SAS. All rights reserved.

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

import getProcess from './getProcess';
import getProcesses from './getProcesses';
import processify from './processify';
import getAdaptor from './getAdaptor';

export default function getAgent(objectOrUrl) {
  try {
    const adaptor = getAdaptor(objectOrUrl);
    return adaptor.getInfo().then(res => {
      const agent = res.body;
      agent.url = adaptor.url;
      agent.getProcess = getProcess.bind(null, agent);
      agent.getProcesses = getProcesses.bind(null, adaptor);
      agent.processes = Object.keys(agent.processes)
        .map(key => agent.processes[key])
        .reduce((map, p) => {
          const updatedMap = map;
          updatedMap[p.name] = processify(adaptor, p);
          return updatedMap;
        }, {});
      return agent;
    });
  } catch (err) {
    return Promise.reject(err);
  }
}
