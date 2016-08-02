import create from '../src/create';
import memoryStore from '../src/memoryStore';
import hashJson from '../src/hashJson';
import generateSecret from '../src/generateSecret';
import { memoryStoreInfo } from './fixtures';

const actions = {
  init(a, b, c) { this.append({ a, b, c }); },
  action(d) { this.state.d = d; this.append(); }
};

// TODO: could be improved by using a dummy fossilizer.
describe('Agent', () => {
  let agent;

  beforeEach(() => {
    agent = create(actions, memoryStore(), null, { agentUrl: 'http://localhost' });
  });
  afterEach(() => {
    delete actions.events;
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

    it('should call the #didAppend() event', () => {
      let callCount = 0;
      actions.events = {
        didAppend(s) {
          callCount++;
          s.link.state.should.deepEqual({ a: 1, b: 2, c: 3 });
          this.state.should.deepEqual({ a: 1, b: 2, c: 3 });
        }
      };
      return agent
        .createMap(1, 2, 3)
        .then(() => {
          callCount.should.be.exactly(1);
        });
    });
  });

  describe('#createSegment()', () => {
    it('resolves with the new segment', () =>
      agent
        .createMap(1, 2, 3)
        .then(segment1 => (
          agent
            .createSegment(segment1.meta.linkHash, 'action', 4)
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
      )
    );

    it('should call the #didAppend() event', () =>
      agent
        .createMap(1, 2, 3)
        .then(segment1 => {
          let callCount = 0;
          actions.events = {
            didAppend(s) {
              callCount++;
              s.link.state.should.deepEqual({ a: 1, b: 2, c: 3, d: 4 });
              this.state.should.deepEqual({ a: 1, b: 2, c: 3, d: 4 });
            }
          };
          return agent
            .createSegment(segment1.meta.linkHash, 'action', 4)
            .then(() => {
              callCount.should.be.exactly(1);
            });
        })
    );
  });

  describe('#insertEvidence()', () => {
    it('resolves with the updated segment', () =>
      agent
        .createMap(1, 2, 3)
        .then(segment1 => {
          const secret = generateSecret(segment1.meta.linkHash, '');
          return agent
            .insertEvidence(segment1.meta.linkHash, { test: true }, secret)
            .then(segment2 => {
              segment2.link.state.should.deepEqual({ a: 1, b: 2, c: 3 });
              segment2.link.meta.mapId.should.be.a.String();
              segment2.link.meta.stateHash.should.be.exactly(hashJson({ a: 1, b: 2, c: 3 }));
              segment2.link.meta.action.should.be.exactly('init');
              segment2.link.meta.arguments.should.deepEqual([1, 2, 3]);
              segment2.meta.linkHash.should.be.exactly(hashJson(segment2.link));
              segment2.meta.agentUrl.should.be.exactly('http://localhost');
              segment2.meta.segmentUrl.should.be.exactly(`http://localhost/segments/${segment2.meta.linkHash}`);
              segment2.meta.evidence.should.deepEqual({ state: 'COMPLETE', test: true });
            });
        })
    );

    it('fails if the secret is incorrect', () =>
      agent
        .createMap(1, 2, 3)
        .then(segment1 =>
          agent
            .insertEvidence(segment1.meta.linkHash, { test: true }, 'wrong secret')
            .then(() => { throw new Error('should have failed'); })
            .catch(err => {
              err.message.should.be.exactly('unauthorized');
              err.status.should.be.exactly(401);
            })
        )
    );

    it('should call the #didFossilize() event', () =>
      agent
        .createMap(1, 2, 3)
        .then(segment => {
          let callCount = 0;
          actions.events = {
            didFossilize(s) {
              callCount++;
              s.meta.evidence.should.deepEqual({ state: 'COMPLETE', test: true });
              this.state.should.deepEqual({ a: 1, b: 2, c: 3 });
            }
          };
          const secret = generateSecret(segment.meta.linkHash, '');
          return agent
            .insertEvidence(segment.meta.linkHash, { test: true }, secret)
            .then(() => {
              callCount.should.be.exactly(1);
            });
        })
    );
  });
});
