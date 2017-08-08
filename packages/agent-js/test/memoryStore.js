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

import memoryStore from '../src/memoryStore';
import { memoryStoreInfo, segment1, segment2, segment3 } from './fixtures';

describe('MemoryStore', () => {
  let store;

  beforeEach(() => { store = memoryStore(); });

  describe('#getInfo()', () => {
    it('resolves with the store info', () =>
      store
        .getInfo()
        .then(body => body.should.deepEqual(memoryStoreInfo))
    );
  });

  describe('#saveSegment()', () => {
    it('resolves with the segment', () =>
      store
        .saveSegment(segment1)
        .then(body => body.should.deepEqual(segment1))
    );
  });

  describe('#getSegment()', () => {
    it('resolves with the segment', () =>
      store
        .saveSegment(segment1)
        .then(sg => store.getSegment('first', 'segment1'))
        .then(body => body.should.deepEqual(segment1))
    );

    it('rejects if there is an error', () =>
      store
        .getSegment('notFound', 'test')
        .then(() => { throw new Error('should not resolve'); })
        .catch(err => {
          err.status.should.be.exactly(404);
          err.message.should.be.exactly('not found');
        })
    );
  });

  describe('#deleteSegment()', () => {
    it('resolves with the deleted segment', () =>
      store
        .saveSegment(segment1)
        .then(() => store.deleteSegment('segment1'))
        .then(body => body.should.deepEqual(segment1))
    );

    it('rejects if there is an error', () =>
      store
        .deleteSegment('notFound')
        .then(() => { throw new Error('should not resolve'); })
        .catch(err => {
          err.status.should.be.exactly(404);
          err.message.should.be.exactly('not found');
        })
    );
  });

  describe('#findSegments()', () => {
    beforeEach(() =>
      store
        .saveSegment(segment1)
        .then(() => store.saveSegment(segment2))
        .then(() => store.saveSegment(segment3))
    );

    it('resolves with the segments', () =>
      store
        .findSegments('first')
        .then(body => body.should.deepEqual([segment2, segment1]))
    );

    it('paginages', () =>
      store
        .findSegments('first', { offset: 1, limit: 1 })
        .then(body => body.should.deepEqual([segment1]))
    );

    it('filters by map ID', () =>
      store
        .findSegments('first', { mapId: 'one' })
        .then(body => body.should.deepEqual([segment2, segment1]))
    );

    it('filters previous link hash', () =>
      store
        .findSegments('first', { prevLinkHash: 'segment1' })
        .then(body => body.should.deepEqual([segment2]))
    );

    it('filters by tags', () =>
      store
        .findSegments('first', { tags: ['one', 'two'] })
        .then(body => body.should.deepEqual([segment2]))
    );
  });

  describe('#getMapIds()', () => {
    beforeEach(() =>
      store
        .saveSegment(segment1)
        .then(() => store.saveSegment(segment2))
        .then(() => store.saveSegment(segment3))
    );

    it('resolves with the map IDs', () =>
      store
        .getMapIds('first')
        .then(body => body.should.deepEqual(['one']))
    );

    it('sends a query', () =>
      store
        .getMapIds('first', { offset: 0, limit: 1 })
        .then(body => body.should.deepEqual(['one']))
    );
  });
});
