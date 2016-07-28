import request from 'superagent';
import mocker from 'superagent-mocker';
import create from '../src/create';
import storeHttpClient from '../src/storeHttpClient';
import hashJson from '../src/hashJson';
import mockStore from './mockStore';

mockStore(mocker(request));

const storeClient = storeHttpClient('http://localhost');

const actions = {
  init(a, b, c) { this.append({ a, b, c }); },
  action(d) { this.state.d = d; this.append(); }
};

const agent = create(actions, storeClient, { agentUrl: 'http://localhost' });

describe('Agent', () => {
  describe('#getInfo()', () => {
    it('resolves with the agent info', () =>
      agent
        .getInfo()
        .then(info => info.should.deepEqual({
          storeInfo: { name: 'mock' },
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
        .createSegment('full', 'action', 4)
        .then(segment => {
          segment.link.state.should.deepEqual({ a: 1, b: 2, c: 3, d: 4 });
          segment.link.meta.stateHash.should.be.exactly(hashJson({ a: 1, b: 2, c: 3, d: 4 }));
          segment.link.meta.action.should.be.exactly('action');
          segment.link.meta.arguments.should.deepEqual([4]);
          segment.meta.linkHash.should.be.exactly(hashJson(segment.link));
          segment.meta.evidence.should.deepEqual({ state: 'DISABLED' });
          segment.meta.agentUrl.should.be.exactly('http://localhost');
          segment.meta.segmentUrl.should.be.exactly(`http://localhost/segments/${segment.meta.linkHash}`);
        })
    );
  });
});
