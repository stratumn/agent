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

  runTestsWithDataAndAgent(process => {
    it('adds actions to the segment', () =>
      process
        .createMap('hi there')
        .then(segment1 =>
          segment1
            .addMessage('hello', 'me')
            .then(segment2 => {
              segment2.link.meta.prevLinkHash.should.be.exactly(segment1.meta.linkHash);
              segment2.link.state.messages.should.deepEqual([{ message: 'hello', author: 'me' }]);
            })
        )
    );

    it('handles actions errors', () =>
      process
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
        )
    );

    it('adds a #getPrev() method to the segment', () =>
      process
        .createMap('hi there')
        .then(segment1 =>
          segment1
            .addMessage('hello', 'me')
            .then(segment2 => segment2.getPrev())
            .then(segment3 => {
              segment3.link.should.deepEqual(segment1.link);
              segment3.meta.should.deepEqual(segment1.meta);
              return segment3.getPrev();
            })
            .then(segment4 => {
              (segment4 === null).should.be.exactly(true);
            })
        )
    );

    // Deprecated
    it('adds a #load() method to the segment', () =>
      process
        .createMap('hi there')
        .then(segment1 =>
          segment1
            .load()
            .then(segment2 => {
              segment2.link.should.deepEqual(segment1.link);
              segment2.meta.should.deepEqual(segment1.meta);
            })
        )
    );

    // Deprecated
    it('adds a #getBranches() method to the segment', () =>
      process
        .createMap('hi there')
        .then(segment =>
          Promise
            .all([segment.addMessage('message one', 'me'), segment.addMessage('message two', 'me')])
            .then(() => segment.getBranches())
            .then(segments => {
              segments.length.should.be.exactly(2);
              segments[0].link.meta.prevLinkHash.should.be.exactly(segment.meta.linkHash);
              segments[1].link.meta.prevLinkHash.should.be.exactly(segment.meta.linkHash);
            })
        )
    );
  });

});
