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

import { ChainValidator } from 'mapexplorer-core';

import validMap from '../fixtures/fullMap.json';
import validSegment from '../fixtures/validSegment.json';

describe('ChainValidator', () => {
  function validate(map) {
    return new ChainValidator(map).validate();
  }

  describe('With a valid map', (done) => {
    it('validates the linkHash', () => {
      Object.values(validate(validMap)).forEach(type => {
        Promise.all(type).then(done).catch(done);
      });
    });
  });

  describe('With only a segment', (done) => {
    it('validates the linkHash', () => {
      Object.values(validate(validSegment)).forEach(type => {
        Promise.all(type).then(done).catch(done);
      });
    });
  });
});
