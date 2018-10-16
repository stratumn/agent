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

import fs from 'fs';
import { join } from 'path';
import fromSegment from '../src/fromSegment';
import { runTestsWithDataAndAgent } from './utils/testSetUp';

describe('#fromSegment', () => {
  const raw = JSON.parse(
    fs.readFileSync(join(__dirname, './fixtures/segment.json'))
  );
  const wrongRaw = JSON.parse(
    fs.readFileSync(join(__dirname, './fixtures/segment2.json'))
  );

  it('loads a segment', () =>
    fromSegment(raw).then(({ process, segment }) => {
      process.findSegments.should.be.a.Function();
      segment.link.should.deepEqual(raw.link);
    }));

  it('throws an error when process does not exist', () =>
    fromSegment(wrongRaw)
      .then(() => {
        throw new Error('Should have failed');
      })
      .catch(err => {
        err.message.should.be.exactly("process 'undefined' not found");
      }));

  runTestsWithDataAndAgent(processCb => {
    it('loads a segment that can execute actions', () =>
      processCb()
        .createMap('Hi')
        .then(segment => processCb().getSegment(segment.meta.linkHash))
        .then(segment =>
          fromSegment({ link: segment.link, meta: segment.meta })
        )
        .then(({ process, segment }) => {
          process.findSegments.should.be.a.Function();
          segment.addMessage.should.be.a.Function();
          return segment.addMessage('hello', 'bob');
        })
        .then(segment => {
          segment.addMessage.should.be.a.Function();
        }));
  });
});
