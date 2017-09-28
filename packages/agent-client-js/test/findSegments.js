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

describe('#findSegments', () => {

  runTestsWithDataAndAgent(processCb => {
    it('finds the segments', () =>
      processCb()
        .createMap('hi')
        .then(() => processCb().createMap('hi'))
        .then(() => processCb().findSegments())
        .then(segments => {
          segments.should.be.an.Array();
          segments.length.should.be.exactly(2);
        })
    );

    it('finds the tagged segments', () =>
      processCb()
        .createMap('hi')
        .then(() => processCb().createMap('hi'))
        .then(segment => segment.addMessage('hello', 'bob'))
        .then(segment => segment.addTag('myTag'))
        .then(segment => segment.addTag('myTag2'))
        .then(() => processCb().findSegments({ tags: ['myTag', 'myTag2'] }))
        .then(segments => {
          segments.should.be.an.Array();
          segments.length.should.be.exactly(1);
        })
        .then(() => processCb().findSegments({ tags: ['myTag'] }))
        .then(segments => {
          segments.should.be.an.Array();
          segments.length.should.be.exactly(2);
        })
    );

    it('applies the options mapId', () =>
      processCb()
        .createMap('hi')
        .then(() => processCb().createMap('hi'))
        .then(segment => processCb().findSegments({ mapIds: [segment.link.meta.mapId] }))
        .then(segments => {
          segments.should.be.an.Array();
          segments.length.should.be.exactly(1);
        })
    );

    it('loads all segments with a limit of -1', () =>
      processCb()
        .createMap('hi')
        .then(() => processCb().createMap('hi'))
        .then(() => processCb().findSegments({ limit: -1, batchSize: 1 }))
        .then(segments => {
          segments.should.be.an.Array();
          segments.length.should.be.exactly(2);
        })
    );

    it('loads all segments with a limit of -1', () =>
      processCb()
        .createMap('hi')
        .then(() => processCb().createMap('hi'))
        .then(() => processCb().findSegments({ limit: -1, batchSize: 2 }))
        .then(segments => {
          segments.should.be.an.Array();
          segments.length.should.be.exactly(2);
        })
    );

    it('returns segmentified segments', () =>
      processCb()
        .createMap('hi')
        .then(() => processCb().createMap('hi'))
        .then(() => processCb().findSegments())
        .then(segments => {
          segments.forEach(segment => segment.getPrev.should.be.a.Function());
        })
    );
  });

});
