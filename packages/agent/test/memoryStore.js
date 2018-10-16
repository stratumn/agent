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

import memoryStore from '../src/memoryStore';
import { memoryStoreInfo, segment1, segment2, segment3 } from './fixtures';
import hashJson from '../src/hashJson';

describe('MemoryStore', () => {
  let store;

  beforeEach(() => {
    store = memoryStore();
  });

  describe('#getInfo()', () => {
    it('resolves with the store info', () =>
      store.getInfo().then(body => body.should.deepEqual(memoryStoreInfo)));
  });

  describe('#createLink()', () => {
    it('resolves with the segment', () =>
      store
        .createLink(segment1.link)
        .then(body => body.should.deepEqual(segment1)));
  });

  describe('#getSegment()', () => {
    it('resolves with the segment', () =>
      store
        .createLink(segment1.link)
        .then(() => store.getSegment('first', segment1.meta.linkHash))
        .then(body => body.should.deepEqual(segment1)));

    it('rejects if there is an error', () =>
      store
        .getSegment('notFound', 'test')
        .then(() => {
          throw new Error('should not resolve');
        })
        .catch(err => {
          err.status.should.be.exactly(404);
          err.message.should.be.exactly('not found');
        }));
  });

  describe('#findSegments()', () => {
    beforeEach(() =>
      store
        .createLink(segment1.link)
        .then(() => store.createLink(segment2.link))
        .then(() => store.createLink(segment3.link))
    );

    it('resolves with the segments', () =>
      store.findSegments('first').then(({ segments, totalCount }) => {
        segments.should.deepEqual([segment2, segment1]);
        totalCount.should.equal(2);
      }));

    it('paginates', () =>
      store
        .findSegments('first', { offset: 1, limit: 1 })
        .then(({ segments, totalCount }) => {
          segments.should.deepEqual([segment1]);
          totalCount.should.equal(2);
        }));

    it('paginates with default limit', () => {
      // Save >20 segments

      const generateSegment = h => {
        const link = {
          state: { value: h },
          meta: {
            process: 'third',
            mapId: 'three',
            tags: ['three'],
            priority: 3
          }
        };

        return {
          link,
          meta: {
            linkHash: hashJson(link)
          }
        };
      };

      for (let i = 0; i < 22; i += 1) {
        store.createLink(generateSegment(i).link);
      }

      // Check that response only has 20 segments
      return store.findSegments('third').then(({ segments, totalCount }) => {
        segments.should.have.length(20);
        totalCount.should.equal(22);
      });
    });

    it('rejects if max limit exceeded', () =>
      store
        .findSegments('first', { limit: 201 })
        .then(() => {
          throw new Error('should not resolve');
        })
        .catch(err => {
          err.status.should.be.exactly(400);
          err.message.should.be.exactly('maximum limit should be 200');
        }));

    it('filters by map ID', () =>
      store
        .findSegments('first', { mapId: 'one' })
        .then(({ segments, totalCount }) => {
          segments.should.deepEqual([segment2, segment1]);
          totalCount.should.equal(2);
        }));

    it('filters previous link hash', () =>
      store
        .findSegments('first', { prevLinkHash: 'segment1' })
        .then(({ segments, totalCount }) => {
          segments.should.deepEqual([segment2]);
          totalCount.should.equal(1);
        }));

    it('filters by linkHashes', () =>
      store
        .findSegments('first', { linkHashes: [segment2.meta.linkHash] })
        .then(({ segments, totalCount }) => {
          segments.should.deepEqual([segment2]);
          totalCount.should.equal(1);
        }));

    it('filters by tags', () =>
      store
        .findSegments('first', { tags: ['one', 'two'] })
        .then(({ segments, totalCount }) => {
          segments.should.deepEqual([segment2]);
          totalCount.should.equal(1);
        }));
  });

  describe('#getMapIds()', () => {
    beforeEach(() =>
      store
        .createLink(segment1.link)
        .then(() => store.createLink(segment2.link))
        .then(() => store.createLink(segment3.link))
    );

    it('resolves with the map IDs', () =>
      store.getMapIds('first').then(body => body.should.deepEqual(['one'])));

    it('sends a query', () =>
      store
        .getMapIds('first', { offset: 0, limit: 1 })
        .then(body => body.should.deepEqual(['one'])));
  });
});
