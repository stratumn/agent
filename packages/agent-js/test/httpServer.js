import request from 'superagent';
import mocker from 'superagent-mocker';
import supertest from 'supertest';
import httpServer from '../src/httpServer';
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

const server = httpServer(agent);

function testFn(req, fn) {
  return new Promise((resolve, reject) => {
    req
      .end((err, res) => {
        try {
          fn(err, res);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
  });
}

function testDeepEquals(req, status, body) {
  return new Promise((resolve, reject) => {
    req
      .expect(status, body)
      .end(err => {
        if (err) {
          reject(err);
        }
        resolve();
      });
  });
}

// TODO: tests
describe('HttpServer()', () => {
  describe('GET "/"', () => {
    it('renders the agent info', () =>
      agent
        .getInfo()
        .then(info => testDeepEquals(supertest(server).get('/'), 200, info))
    );
  });

  describe('POST "/segments"', () => {
    it('renders the first segment', () => {
      const req = supertest(server).post('/segments').send([1, 2, 3]);
      return testFn(req, (err, res) => {
        if (err) { throw err; }
        res.status.should.be.exactly(200);
        const segment = res.body;
        segment.link.state.should.deepEqual({ a: 1, b: 2, c: 3 });
        segment.link.meta.mapId.should.be.a.String();
        segment.link.meta.stateHash.should.be.exactly(hashJson({ a: 1, b: 2, c: 3 }));
        segment.link.meta.action.should.be.exactly('init');
        segment.link.meta.arguments.should.deepEqual([1, 2, 3]);
        segment.meta.linkHash.should.be.exactly(hashJson(segment.link));
        segment.meta.evidence.should.deepEqual({ state: 'DISABLED' });
        segment.meta.agentUrl.should.be.exactly('http://localhost');
        segment.meta.segmentUrl.should.be.exactly(`http://localhost/segments/${segment.meta.linkHash}`);
      });
    });
  });

  describe('POST "/segments/:linkHash/:action"', () => {
    it('renders the new segment', () => {
      const req = supertest(server).post('/segments/full/action').send([4]);
      return testFn(req, (err, res) => {
        if (err) { throw err; }
        res.status.should.be.exactly(200);
        const segment = res.body;
        segment.link.state.should.deepEqual({ a: 1, b: 2, c: 3, d: 4 });
        segment.link.meta.stateHash.should.be.exactly(hashJson({ a: 1, b: 2, c: 3, d: 4 }));
        segment.link.meta.action.should.be.exactly('action');
        segment.link.meta.arguments.should.deepEqual([4]);
        segment.meta.linkHash.should.be.exactly(hashJson(segment.link));
        segment.meta.evidence.should.deepEqual({ state: 'DISABLED' });
        segment.meta.agentUrl.should.be.exactly('http://localhost');
        segment.meta.segmentUrl.should.be.exactly(`http://localhost/segments/${segment.meta.linkHash}`);
      });
    });
  });

  describe('GET "/segments/:linkHash"', () => {
    it('renders the segment', () =>
      agent
        .getSegment('full')
        .then(segment => testDeepEquals(supertest(server).get('/segments/full'), 200, segment))
    );
  });

  describe('GET "/segments"', () => {
    it('renders the segments', () =>
      agent
        .findSegments({ limit: 20 })
        .then(segments =>
          testDeepEquals(supertest(server).get('/segments?limit=20'), 200, segments)
        )
    );
  });

  describe('GET "/maps"', () => {
    it('renders the map IDs', () =>
      agent
        .getMapIds({ limit: 20 })
        .then(mapIds => testDeepEquals(supertest(server).get('/maps?limit=20'), 200, mapIds))
    );
  });

  // Legacy routes

  describe('[DEPRECATED] POST "/maps"', () => {
    it('renders the first segment', () => {
      const req = supertest(server).post('/maps').send([1, 2, 3]);
      return testFn(req, (err, res) => {
        if (err) { throw err; }
        res.status.should.be.exactly(200);
        const segment = res.body;
        segment.link.state.should.deepEqual({ a: 1, b: 2, c: 3 });
        segment.link.meta.mapId.should.be.a.String();
        segment.link.meta.stateHash.should.be.exactly(hashJson({ a: 1, b: 2, c: 3 }));
        segment.link.meta.action.should.be.exactly('init');
        segment.link.meta.arguments.should.deepEqual([1, 2, 3]);
        segment.meta.linkHash.should.be.exactly(hashJson(segment.link));
        segment.meta.evidence.should.deepEqual({ state: 'DISABLED' });
        segment.meta.agentUrl.should.be.exactly('http://localhost');
        segment.meta.segmentUrl.should.be.exactly(`http://localhost/segments/${segment.meta.linkHash}`);
      });
    });
  });

  describe('[DEPRECATED] POST "/links/:linkHash/:action"', () => {
    it('renders the new segment', () => {
      const req = supertest(server).post('/links/full/action').send([4]);
      return testFn(req, (err, res) => {
        if (err) { throw err; }
        res.status.should.be.exactly(200);
        const segment = res.body;
        segment.link.state.should.deepEqual({ a: 1, b: 2, c: 3, d: 4 });
        segment.link.meta.stateHash.should.be.exactly(hashJson({ a: 1, b: 2, c: 3, d: 4 }));
        segment.link.meta.action.should.be.exactly('action');
        segment.link.meta.arguments.should.deepEqual([4]);
        segment.meta.linkHash.should.be.exactly(hashJson(segment.link));
        segment.meta.evidence.should.deepEqual({ state: 'DISABLED' });
        segment.meta.agentUrl.should.be.exactly('http://localhost');
        segment.meta.segmentUrl.should.be.exactly(`http://localhost/segments/${segment.meta.linkHash}`);
      });
    });
  });

  describe('[DEPRECATED] GET "/links/:linkHash"', () => {
    it('renders the segment', () =>
      agent
        .getSegment('full')
        .then(segment => testDeepEquals(supertest(server).get('/links/full'), 200, segment))
    );
  });

  describe('[DEPRECATED] GET "/links"', () => {
    it('renders the segments', () =>
      agent
        .findSegments({ limit: 20 })
        .then(segments =>
          testDeepEquals(supertest(server).get('/links?limit=20'), 200, segments)
        )
    );
  });

  describe('[DEPRECATED] GET "/maps/:id"', () => {
    it('renders the segments', () =>
      agent
        .findSegments({ mapId: 'test' })
        .then(segments => testDeepEquals(supertest(server).get('/maps/test'), 200, segments))
    );
  });

  describe('[DEPRECATED] GET "/branches/:linkHash"', () => {
    it('renders the segments', () =>
      agent
        .findSegments({ prevLinkHash: 'test' })
        .then(segments => testDeepEquals(supertest(server).get('/branches/test'), 200, segments))
    );
  });
});
