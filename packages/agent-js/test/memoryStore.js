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
        .then(() => store.getSegment('segment1'))
        .then(body => body.should.deepEqual(segment1))
    );

    it('rejects if there is an error', () =>
      store
        .getSegment('notFound')
        .then(() => { throw new Error('should not resolve'); })
        .catch(err => {
          err.statusCode.should.be.exactly(404);
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
        .findSegments()
        .then(body => body.should.deepEqual([segment3, segment2, segment1]))
    );

    it('paginages', () =>
      store
        .findSegments({ offset: 1, limit: 1 })
        .then(body => body.should.deepEqual([segment2]))
    );

    it('filters by map ID', () =>
      store
        .findSegments({ mapId: 'one' })
        .then(body => body.should.deepEqual([segment2, segment1]))
    );

    it('filters previous link hash', () =>
      store
        .findSegments({ prevLinkHash: 'segment1' })
        .then(body => body.should.deepEqual([segment2]))
    );

    it('filters by tags', () =>
      store
        .findSegments({ tags: ['one', 'two'] })
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
        .getMapIds()
        .then(body => body.should.deepEqual(['one', 'two']))
    );

    it('sends a query', () =>
      store
        .getMapIds({ offset: 0, limit: 1 })
        .then(body => body.should.deepEqual(['one']))
    );
  });
});
