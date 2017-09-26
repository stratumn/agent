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

import { get, post } from './request';
import makeQueryString from './makeQueryString';

class httpAdaptor {
  constructor(url) {
    this.agentUrl = url;
  }

  getInfo() {
    return get(this.url);
  }

  getProcesses() {
    return get(`${this.url}/processes`);
  }

  createMap(processName, ...args) {
    return post(`${this.url}/${processName}/segments`, args);
  }

  getSegment(processName, linkHash) {
    return get(`${this.url}/${processName}/segments/${linkHash}`);
  }

  findSegments(processName, opts = {}) {
    return get(`${this.url}/${processName}/segments${makeQueryString(opts)}`);
  }

  getMapIds(processName, opts = {}) {
    return get(`${this.url}/${processName}/maps${makeQueryString(opts)}`);
  }

  createSegment(processName, linkHash, action, ...args) {
    return post(`${this.url}/${processName}/segments/${linkHash}/${action}`, args);
  }

  get url() {
    return this.agentUrl;
  }
}


const decorateBody = res => ({ body: res });

class objectAdaptor {
  constructor(agent) {
    this.agent = agent;
  }

  getInfo() {
    return this.agent.getInfo()
      .then(decorateBody);
  }

  getProcesses() {
    return Promise.resolve(decorateBody(this.agent.getAllProcesses()));
  }

  createMap(processName, ...args) {
    try {
      return this.agent
        .getProcess(processName)
        .createMap(...args)
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

  createSegment(processName, linkHash, action, ...args) {
    try {
      return this.agent
        .getProcess(processName)
        .createSegment(linkHash, action, ...args)
        .then(decorateBody);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  get url() {
    return null;
  }
}

module.exports = { httpAdaptor, objectAdaptor };
