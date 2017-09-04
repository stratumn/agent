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

import deprecated from './deprecated';
import getBranches from './getBranches';
import { post } from './request';

export default function segmentify(process, obj) {
  Object.keys(process.processInfo.actions)
    .filter(key => ['init'].indexOf(key) < 0)
    .forEach(key => {
      /*eslint-disable*/
      obj[key] = (...args) => {
        return post(`${process.prefixUrl}/segments/${obj.meta.linkHash}/${key}`, args)
          .then(res => segmentify(process, res.body));
      }
    });

  /*eslint-disable*/
  obj.getPrev = () => {
    /*eslint-enable*/
    if (obj.link.meta.prevLinkHash) {
      return process.getSegment(obj.link.meta.prevLinkHash);
    }

    return Promise.resolve(null);
  };

  // Deprecated.
  /*eslint-disable*/
  obj.load = () => {
    /*eslint-enable*/
    deprecated('segment#load()');
    return Promise.resolve(segmentify(process, {
      link: JSON.parse(JSON.stringify(obj.link)),
      meta: JSON.parse(JSON.stringify(obj.meta))
    }));
  };

  // Deprecated.
  /*eslint-disable*/
  obj.getBranches = (...args) => {
    /*eslint-enable*/
    return getBranches(process, obj.meta.linkHash, ...args);
  };

  return obj;
}
