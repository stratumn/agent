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

import url from 'url';

import { get, post } from './request';
import makeQueryString from './makeQueryString';

export default class httpAdaptor {
  constructor(agentUrl) {
    this.agentUrl = agentUrl;
  }

  getInfo() {
    return get(this.url);
  }

  getProcesses() {
    return get(url.resolve(this.url, 'processes'));
  }

  createMap(processName, signatures, refs, ...args) {
    return post(url.resolve(this.url, `${processName}/segments`), [
      signatures,
      refs,
      ...args
    ]);
  }

  getSegment(processName, linkHash) {
    return get(url.resolve(this.url, `${processName}/segments/${linkHash}`));
  }

  findSegments(processName, opts = {}) {
    return get(
      url.resolve(this.url, `${processName}/segments${makeQueryString(opts)}`)
    );
  }

  getMapIds(processName, opts = {}) {
    return get(
      url.resolve(this.url, `${processName}/maps${makeQueryString(opts)}`)
    );
  }

  createSegment(processName, linkHash, action, signatures, refs, ...args) {
    return post(
      url.resolve(this.url, `${processName}/segments/${linkHash}/${action}`),
      [signatures, refs, ...args]
    );
  }

  get url() {
    return this.agentUrl;
  }
}
