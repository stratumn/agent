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

// need to clone data as client will modify it!
const decorateBody = res => ({ body: JSON.parse(JSON.stringify(res)) });

export default class objectAdaptor {
  constructor(agent) {
    this.agent = agent;
  }

  getInfo() {
    return this.agent.getInfo().then(decorateBody);
  }

  getProcesses() {
    return this.agent.getAllProcesses().then(decorateBody);
  }

  createMap(processName, signatures, refs, ...args) {
    try {
      return this.agent
        .getProcess(processName)
        .createMap(signatures, refs, ...args)
        .then(decorateBody);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  getSegment(processName, linkHash) {
    try {
      return this.agent
        .getProcess(processName)
        .getSegment(linkHash)
        .then(decorateBody);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  findSegments(processName, opts = {}) {
    try {
      return this.agent
        .getProcess(processName)
        .findSegments(opts)
        .then(decorateBody);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  getMapIds(processName, opts = {}) {
    try {
      return this.agent
        .getProcess(processName)
        .getMapIds(opts)
        .then(decorateBody);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  createSegment(processName, linkHash, action, signatures, refs, ...args) {
    try {
      return this.agent
        .getProcess(processName)
        .createSegment(linkHash, action, signatures, refs, ...args)
        .then(decorateBody);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /* eslint-disable */
  get url() {
    return null;
  }
  /* eslint-enable */
}
