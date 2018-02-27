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

import withRefs from './withRefs';
import { withKey } from './withKey';
import { sign, signedProperties } from './sign';

export default function segmentify(adaptor, process, segment) {
  // actionify returns the segmentified object that results from a transition execution
  // if the passed segment has a 'signed' property, the provided attributes will be signed and the output signature sent to the agent
  const actionify = (action, ...args) => {
    // TODO: handle multi-sig on a single segment
    const { signed, refs, key } = segment;

    const createSegment = signature =>
      adaptor
        .createSegment(
          process.name,
          segment.meta.linkHash,
          action,
          signature ? [signature] : [],
          refs,
          ...args
        )
        .then(res => segmentify(adaptor, process, { ...res.body, key: key }));

    if (signed) {
      const data = {
        inputs: signed.inputs ? args : false,
        action: signed.action ? action : false,
        refs: signed.refs ? refs : false,
        prevLinkHash: signed.prevLinkHash ? segment.meta.linkHash : false
      };
      return sign(key, data).then(createSegment);
    }
    return createSegment();
  };

  // extend the segment with action functions
  Object.keys(process.processInfo.actions)
    .filter(action => action !== 'init')
    .forEach(action => {
      segment[action] = (...args) => actionify(action, ...args);
    });

  // use the key passed to the process if the segment doesn't already have one
  if (!segment.key) {
    segment.key = process.key;
  }

  // add utility functions to the segment
  segment.getPrev = () => {
    if (segment.link.meta.prevLinkHash) {
      return process.getSegment(segment.link.meta.prevLinkHash);
    }

    return Promise.resolve(null);
  };

  segment.withRefs = withRefs.bind(null, segment);
  segment.withKey = withKey.bind(null, segment);
  segment.sign = signedProperties.bind(null, segment);
  return segment;
}
