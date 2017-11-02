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

import { runTestsWithDataAndAgent } from './utils/testSetUp';

describe('#createMap', () => {
  runTestsWithDataAndAgent(processCb => {
    it('creates a map', () =>
      processCb()
        .createMap('Test')
        .then(segment => {
          segment.link.state.title.should.be.exactly('Test');
        }));

    it('creates a map with references', () =>
      processCb()
        .withRefs([{ linkHash: 'test', process: 'test' }])
        .createMap('Test')
        .then(segment => {
          segment.link.state.title.should.be.exactly('Test');
          segment.link.meta.refs.should.deepEqual([
            {
              linkHash: 'test',
              process: 'test'
            }
          ]);
        }));

    it('fails when creating a map with a bad reference', () =>
      processCb()
        .withRefs([{ process: 'test' }])
        .createMap('Test')
        .then(() => {
          throw new Error('Should have failed');
        })
        .catch(err => {
          err.status.should.be.exactly(400);
          err.message.should.be.exactly(
            'missing segment or (process and linkHash)'
          );
        }));

    it('handles error if arguments do not match those of "init" function', () =>
      processCb()
        .createMap()
        .then(() => {
          throw new Error('it should have failed');
        })
        .catch(err => {
          err.message.should.be.exactly('a title is required');
          err.status.should.be.exactly(400);
        }));
  });
});
