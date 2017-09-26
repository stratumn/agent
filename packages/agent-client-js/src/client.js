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

import { get } from './request';

class httpAdaptor {
  constructor(url) {
    this.agentUrl = url;
  }

  getInfo() {
    return get(this.agentUrl);
  }

  get url() {
    return this.agentUrl;
  }
}

class objectAdaptor {
  constructor(agent) {
    this.agent = agent;
  }

  getInfo() {
    return this.agent.getInfo()
      .then(res => ({ body: res }));
  }

  get url() {
    return 'not/a/url';
  }
}

class agentClient {

  constructor(objectOrUrl) {
    if (typeof objectOrUrl === 'string') {
      this.adaptor = new httpAdaptor(objectOrUrl);
    } else if (typeof objectOrUrl === 'object') {
      this.adaptor = new objectAdaptor(objectOrUrl);
    } else {
      throw new Error('The argument passed is neither a url or an object!');
    }
  }

  // getAgent() {
  //   return this.adaptor.getInfo()
  //   .then(res => {
  //     const agent = res.body;
  //     agent.url = adaptor.url;
  //     agent.getProcesses = getProcesses.bind(null, agent);
  //     agent.processes = Object.keys(agent.processes)
  //       .map(key => agent.processes[key])
  //       .reduce((map, p) => {
  //         const updatedMap = map;
  //         updatedMap[p.name] = processify(p, agent.url);
  //         return updatedMap;
  //       }, {});
  //     return agent;
  //   });
  // }
}

module.exports = { agentClient };
