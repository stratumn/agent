import create from '../src/create';
import memoryStore from '../src/memoryStore';
import hashJson from '../src/hashJson';
import { memoryStoreInfo } from './fixtures';

const actions = {
  init(a, b, c) { this.append({ a, b, c }); },
  action(d) { this.state.d = d; this.append(); }
};

describe('Agent', () => {
  let agent;

  beforeEach(() => {
    agent = create(actions, memoryStore(), { agentUrl: 'http://localhost' });
  });

  describe('#getInfo()', () => {
    it('resolves with the agent info', () =>
      agent
        .getInfo()
        .then(info => info.should.deepEqual({
          storeInfo: memoryStoreInfo,
          agentInfo: {
            functions: {
              init: { args: ['a', 'b', 'c'] },
              action: { args: ['d'] }
            }
          }
        }))
    );
  });

  describe('#createMap()', () => {
    it('resolves with the first segment', () =>
      agent
        .createMap(1, 2, 3)
        .then(segment => {
          segment.link.state.should.deepEqual({ a: 1, b: 2, c: 3 });
          segment.link.meta.mapId.should.be.a.String();
          segment.link.meta.stateHash.should.be.exactly(hashJson({ a: 1, b: 2, c: 3 }));
          segment.link.meta.action.should.be.exactly('init');
          segment.link.meta.arguments.should.deepEqual([1, 2, 3]);
          segment.meta.linkHash.should.be.exactly(hashJson(segment.link));
          segment.meta.evidence.should.deepEqual({ state: 'DISABLED' });
          segment.meta.agentUrl.should.be.exactly('http://localhost');
          segment.meta.segmentUrl.should.be.exactly(`http://localhost/segments/${segment.meta.linkHash}`);
        })
    );
  });

  describe('#createSegment()', () => {
    it('resolves with the new segment', () =>
      agent
        .createMap(1, 2, 3)
        .then(segment1 => (
          agent
            .createSegment(segment1.meta.linkHash, 'action', 4))
            .then(segment2 => {
              segment2.link.state.should.deepEqual({ a: 1, b: 2, c: 3, d: 4 });
              segment2.link.meta.stateHash.should.be.exactly(hashJson({ a: 1, b: 2, c: 3, d: 4 }));
              segment2.link.meta.action.should.be.exactly('action');
              segment2.link.meta.arguments.should.deepEqual([4]);
              segment2.link.meta.prevLinkHash.should.be.exactly(segment1.meta.linkHash);
              segment2.meta.linkHash.should.be.exactly(hashJson(segment2.link));
              segment2.meta.evidence.should.deepEqual({ state: 'DISABLED' });
              segment2.meta.agentUrl.should.be.exactly('http://localhost');
              segment2.meta.segmentUrl.should.be.exactly(`http://localhost/segments/${segment2.meta.linkHash}`);
            })
        )
    );
  });
});
