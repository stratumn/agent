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

describe('#segmentify', () => {
  runTestsWithDataAndAgent(processCb => {
    it('adds actions to the segment', () =>
      processCb()
        .createMap('hi there')
        .then(segment1 =>
          segment1.addMessage('hello', 'me').then(segment2 => {
            segment2.link.meta.prevLinkHash.should.be.exactly(
              segment1.meta.linkHash
            );
            segment2.link.state.messages.should.deepEqual([
              { message: 'hello', author: 'me' }
            ]);
          })
        ));

    it('handles actions errors', () =>
      processCb()
        .createMap('hi there')
        .then(segment1 =>
          segment1
            .addMessage('hello')
            .then(() => {
              throw new Error('should not resolve');
            })
            .catch(err => {
              err.status.should.be.exactly(400);
              err.message.should.be.exactly('an author is required');
            })
        ));

    it('adds a #getPrev() method to the segment', () =>
      processCb()
        .createMap('hi there')
        .then(segment1 =>
          segment1
            .addMessage('hello', 'me')
            .then(segment2 => segment2.getPrev())
            .then(segment3 => {
              segment3.link.should.deepEqual(segment1.link);
              segment3.meta.linkHash.should.be.equal(segment1.meta.linkHash);
              return segment3.getPrev();
            })
            .then(segment4 => {
              (segment4 === null).should.be.exactly(true);
            })
        ));
  });
});
