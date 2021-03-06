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

import { runTestsWithDataAndAgent } from './utils/testSetUp';

describe('#findSegments', () => {
  runTestsWithDataAndAgent(processCb => {
    function processCbWithMaps() {
      return processCb()
        .createMap('hi')
        .then(() => processCb().createMap('hi'));
    }

    it('finds the segments', () =>
      processCbWithMaps()
        .then(() => processCb().findSegments())
        .then(({ segments }) => {
          segments.should.be.an.Array();
          segments.length.should.be.exactly(2);
        }));

    it('finds the tagged segments', () =>
      processCbWithMaps()
        .then(segment => segment.addMessage('hello', 'bob'))
        .then(segment => segment.addTag('myTag'))
        .then(segment => segment.addTag('myTag2'))
        .then(() => processCb().findSegments({ tags: ['myTag', 'myTag2'] }))
        .then(({ segments }) => {
          segments.should.be.an.Array();
          segments.length.should.be.exactly(1);
        })
        .then(() => processCb().findSegments({ tags: ['myTag'] }))
        .then(({ segments }) => {
          segments.should.be.an.Array();
          segments.length.should.be.exactly(2);
        }));

    it('finds segments with a matching linkHash', () => {
      let lHash;
      let segment1;
      return processCbWithMaps()
        .then(segment => {
          lHash = segment.meta.linkHash;
          segment1 = segment;
          return processCb().findSegments({
            linkHashes: [lHash, 'badLinkHash']
          });
        })
        .then(({ segments }) => {
          segments.should.be.an.Array();
          segments.length.should.be.exactly(1);
        })
        .then(() => segment1.addMessage('hello', 'bob'))
        .then(segment =>
          processCb().findSegments({
            linkHashes: [lHash, segment.meta.linkHash]
          })
        )
        .then(({ segments }) => {
          segments.should.be.an.Array();
          segments.length.should.be.exactly(2);
        });
    });

    it('applies the options mapId', () =>
      processCbWithMaps()
        .then(segment =>
          processCb().findSegments({ mapIds: [segment.link.meta.mapId] })
        )
        .then(({ segments }) => {
          segments.should.be.an.Array();
          segments.length.should.be.exactly(1);
        }));

    [1, 2].forEach(batchSize => {
      it(`loads all segments with a limit of -1 with batchSize ${batchSize}`, () =>
        processCbWithMaps()
          .then(() => processCb().findSegments({ limit: -1, batchSize }))
          .then(({ segments, hasMore }) => {
            segments.should.be.an.Array();
            segments.length.should.be.exactly(2);
            hasMore.should.be.false();
          }));
    });

    it('should return pagination info', () =>
      processCbWithMaps()
        .then(() => processCb().findSegments({ limit: 1 }))
        .then(({ segments, hasMore, offset }) => {
          segments.length.should.be.exactly(1);
          hasMore.should.be.true();
          offset.should.be.exactly(1);
        }));

    it('returns segmentified segments', () =>
      processCbWithMaps()
        .then(() => processCb().findSegments())
        .then(({ segments }) => {
          segments.forEach(segment => segment.getPrev.should.be.a.Function());
        }));
  });
});
