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

import { resolveLinks } from '@stratumn/agent-client';
import SegmentValidator from './SegmentValidator';
import wrap from './wrap';
import parseIfJson from './parseIfJson';

export default class MapValidator {
  constructor(chainscript) {
    this.chainscript = chainscript;
    this.errors = {
      linkHash: [],
      stateHash: [],
      merklePath: [],
      fossil: [],
      signatures: []
    };
  }

  validate() {
    try {
      return resolveLinks(
        wrap(parseIfJson(this.chainscript))
      ).then(segments => {
        wrap(segments).forEach(segment =>
          new SegmentValidator(segment).validate(this.errors)
        );
        return this.errors;
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
