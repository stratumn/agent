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

import should from 'should';
import { runTestsWithDataAndAgent } from './utils/testSetUp';

describe('#withRefs', () => {
  runTestsWithDataAndAgent(processCb => {
    it('adds a "refs" field to a process', () =>
      processCb()
        .withRefs([{ linkHash: 'test', process: 'test' }])
        .refs.should.deepEqual([{ linkHash: 'test', process: 'test' }]));

    it('adds a "refs" field to a segment', () => {
      processCb()
        .createMap('first')
        .then(segment =>
          segment
            .withRefs([{ linkHash: 'test', process: 'test' }])
            .refs.should.deepEqual([{ linkHash: 'test', process: 'test' }])
        );
    });

    it('creates a segment with references', () =>
      processCb()
        .withRefs([{ linkHash: 'test', process: 'test' }])
        .createMap('hi there')
        .then(segment1 =>
          segment1
            .withRefs([{ linkHash: 'test2', process: 'test' }])
            .addMessage('hello', 'me')
            .then(s2 => {
              s2.link.meta.refs.should.deepEqual([
                {
                  linkHash: 'test2',
                  process: 'test'
                }
              ]);
            })
        ));

    it('leaves the references empty if none are passed', () =>
      processCb()
        .withRefs([{ linkHash: 'test', process: 'test' }])
        .createMap('hi there')
        .then(segment1 =>
          segment1
            .addMessage('hello', 'me')
            .then(s2 => should(s2.link.meta.refs).be.undefined)
        ));
  });
});
