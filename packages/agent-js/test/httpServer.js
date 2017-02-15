/*
    Stratumn Agent Javascript Library
    Copyright (C) 2016  Stratumn SAS

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import supertest from 'supertest';
import httpServer from '../src/httpServer';
import create from '../src/create';
import memoryStore from '../src/memoryStore';
import hashJson from '../src/hashJson';
import generateSecret from '../src/generateSecret';

const actions = {
  init(a, b, c) { this.append({ a, b, c }); },
  action(d) { this.state.d = d; this.append(); }
};

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

describe('HttpServer()', () => {
  let agent;
  let server;

  beforeEach(() => {
    agent = create(actions, memoryStore(), null, { agentUrl: 'http://localhost' });
    server = httpServer(agent);
  });

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
        segment.meta.linkHash.should.be.exactly(hashJson(segment.link));
        segment.meta.evidence.should.deepEqual({ state: 'DISABLED' });
      });
    });
  });

  describe('POST "/segments/:linkHash/:action"', () => {
    it('renders the new segment', () => {
      agent
        .createMap(1, 2, 3)
        .then(segment1 => {
          const req = supertest(server)
            .post(`/segments/${segment1.meta.linkHash}/action`).send([4]);
          return testFn(req, (err, res) => {
            if (err) { throw err; }
            res.status.should.be.exactly(200);
            const segment2 = res.body;
            segment2.link.state.should.deepEqual({ a: 1, b: 2, c: 3, d: 4 });
            segment2.link.meta.prevLinkHash.should.be.exactly(segment1.link.meta.linkHash);
            segment2.meta.linkHash.should.be.exactly(hashJson(segment2.link));
            segment2.meta.evidence.should.deepEqual({ state: 'DISABLED' });
          });
        });
    });
  });

  describe('GET "/segments/:linkHash"', () => {
    it('renders the segment', () =>
      agent
        .createMap(1, 2, 3)
        .then(segment =>
          testDeepEquals(supertest(server).get(`/segments/${segment.meta.linkHash}`), 200, segment)
        )
    );
  });

  describe('GET "/segments"', () => {
    it('renders the segments', () =>
      agent
        .createMap(1, 2, 3)
        .then(segment => agent.createSegment(segment.meta.linkHash, 'action', 4))
        .then(() => agent.findSegments({ limit: 20 }))
        .then(segments =>
          testDeepEquals(supertest(server).get('/segments?limit=20'), 200, segments)
        )
    );
  });

  describe('GET "/maps"', () => {
    it('renders the map IDs', () =>
      agent
        .createMap(1, 2, 3)
        .then(() => agent.createMap(4, 5, 6))
        .then(() => agent.createMap(7, 8, 9))
        .then(() => agent.getMapIds({ limit: 20 }))
        .then(mapIds => testDeepEquals(supertest(server).get('/maps?limit=20'), 200, mapIds))
    );
  });

  describe('POST "/evidence/:linkHash"', () => {
    it('renders the updated segment', () =>
      agent
        .createMap(1, 2, 3)
        .then(segment1 => {
          const secret = generateSecret(segment1.meta.linkHash, '');
          return agent
            .insertEvidence(segment1.meta.linkHash, { test: true }, secret)
            .then(segment2 =>
              testDeepEquals(
                supertest(server)
                  .post(`/evidence/${segment1.meta.linkHash}?secret=${secret}`)
                  .send({ test: true }),
                200,
                segment2
              )
            );
        })
    );
  });

  describe('GET /404', () => {
    it('renders an error', () =>
      testDeepEquals(supertest(server).get('/404'), 404, { status: 404, error: 'not found' })
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
        segment.meta.linkHash.should.be.exactly(hashJson(segment.link));
        segment.meta.evidence.should.deepEqual({ state: 'DISABLED' });
      });
    });
  });

  describe('[DEPRECATED] POST "/links/:linkHash/:action"', () => {
    it('renders the new segment', () => {
      agent
        .createMap(1, 2, 3)
        .then(segment1 => {
          const req = supertest(server)
            .post(`/links/${segment1.meta.linkHash}/action`).send([4]);
          return testFn(req, (err, res) => {
            if (err) { throw err; }
            res.status.should.be.exactly(200);
            const segment2 = res.body;
            segment2.link.state.should.deepEqual({ a: 1, b: 2, c: 3, d: 4 });
            segment2.link.meta.prevLinkHash.should.be.exactly(segment1.link.meta.linkHash);
            segment2.meta.linkHash.should.be.exactly(hashJson(segment2.link));
            segment2.meta.evidence.should.deepEqual({ state: 'DISABLED' });
          });
        });
    });
  });

  describe('[DEPRECATED] GET "/links/:linkHash"', () => {
    it('renders the segment', () =>
      agent
        .createMap(1, 2, 3)
        .then(segment =>
          testDeepEquals(supertest(server).get(`/links/${segment.meta.linkHash}`), 200, segment)
        )
    );
  });

  describe('[DEPRECATED] GET "/links"', () => {
    it('renders the segments', () =>
      agent
        .createMap(1, 2, 3)
        .then(segment => agent.createSegment(segment.meta.linkHash, 'action', 4))
        .then(() => agent.findSegments({ limit: 20 }))
        .then(segments =>
          testDeepEquals(supertest(server).get('/links?limit=20'), 200, segments)
        )
    );
  });

  describe('[DEPRECATED] GET "/maps/:id"', () => {
    it('renders the segments', () =>
      agent
        .createMap(1, 2, 3)
        .then(segment => (
          agent
            .createMap(4, 5, 6))
            .then(() => agent.createSegment(segment.meta.linkHash, 'action', 10))
            .then(() => agent.findSegments({ mapId: segment.link.meta.mapId }))
            .then(segments =>
              testDeepEquals(
                supertest(server).get(`/maps/${segment.link.meta.mapId}`), 200, segments
              )
            )
        )
    );
  });

  describe('[DEPRECATED] GET "/branches/:linkHash"', () => {
    it('renders the segments', () =>
      agent
        .createMap(1, 2, 3)
        .then(segment => (
          agent
            .createMap(4, 5, 6))
            .then(() => agent.createSegment(segment.meta.linkHash, 'action', 10))
            .then(() => agent.findSegments({ prevLinkHash: segment.meta.linkHash }))
            .then(segments =>
              testDeepEquals(
                supertest(server).get(`/branches/${segment.meta.linkHash}`), 200, segments
              )
            )
        )
    );
  });
});
