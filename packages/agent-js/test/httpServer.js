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

import supertest from 'supertest';
import create from '../src/create';
import memoryStore from '../src/memoryStore';
import hashJson from '../src/hashJson';
import generateSecret from '../src/generateSecret';
import actions from './utils/basicActions';

function testFn(req, fn) {
  return new Promise((resolve, reject) => {
    req.end((err, res) => {
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
    req.expect(status, body).end(err => {
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
  let process;
  let mockFossilizer;

  beforeEach(() => {
    agent = create(actions, memoryStore(), null, {
      agentUrl: 'http://localhost'
    });
    mockFossilizer = {
      fossilize() {
        return Promise.resolve(true);
      }
    };
    process = agent.addProcess('basic', actions, memoryStore(), mockFossilizer);
    server = agent.httpServer();
  });

  describe('GET "/"', () => {
    it('renders the agent info', () => {
      process.fossilizerClient = null;
      return agent
        .getInfo()
        .then(info => testDeepEquals(supertest(server).get('/'), 200, info));
    });
  });

  describe('GET "/processes"', () => {
    it('renders the complete list of processes', () => {
      agent.addProcess('second', actions, memoryStore(), null);
      const req = supertest(server).get('/processes');
      return testFn(req, (err, res) => {
        if (err) {
          throw err;
        }
        res.status.should.be.exactly(200);
        const processes = res.body;
        processes.length.should.be.exactly(2);
        processes[0].name.should.be.a.String();
      });
    });
  });

  describe('POST "/<process>/add"', () => {
    const encodedScript = Buffer.from(
      'module.exports = { ' +
        "name:'hot', " +
        'init: function(title) {' +
        'if (!title) {' +
        "return this.reject('a title is required');" +
        '}' +
        'this.state = {' +
        'title: title' +
        '};' +
        'this.append();' +
        '} ' +
        '};'
    ).toString('base64');

    it('adds a new process and returns the updated list of processes', () => {
      const hotProcess = { script: encodedScript };

      const req = supertest(server)
        .post('/hot/add')
        .send(hotProcess);

      return testFn(req, (err, res) => {
        if (err) {
          throw err;
        }
        res.status.should.be.exactly(200);
        const processes = res.body;
        processes.length.should.be.exactly(2);
        processes[1].name.should.be.exactly('hot');
      });
    });

    it('rejects process with name mismatch', () => {
      const hotProcess = { script: encodedScript };
      const req = supertest(server)
        .post('/not-the-right-name/add')
        .send(hotProcess);

      return testFn(req, (err, res) => {
        if (err) {
          throw err;
        }
        res.status.should.be.exactly(400);
        res.body.error.should.be.exactly(
          "Process name from url doesn't match process name from the script"
        );
      });
    });

    it('rejects process with missing script', () => {
      const hotProcess = { script: '' };
      const req = supertest(server)
        .post('/hot/add')
        .send(hotProcess);

      return testFn(req, (err, res) => {
        if (err) {
          throw err;
        }
        res.status.should.be.exactly(400);
        res.body.error.should.be.exactly('missing script');
      });
    });

    it('rejects process with no exported init function', () => {
      const missingFunctions = Buffer.from(
        "module.exports = { name:'hot'};"
      ).toString('base64');

      const hotProcess = { script: missingFunctions };
      const req = supertest(server)
        .post('/hot/add')
        .send(hotProcess);

      return testFn(req, (err, res) => {
        if (err) {
          throw err;
        }
        res.status.should.be.exactly(400);
        res.body.error.should.be.exactly('missing init function');
      });
    });

    it('rejects process with invalid script', () => {
      const hotProcess = { script: 'this is definitely not a valid script' };
      const req = supertest(server)
        .post('/hot/add')
        .send(hotProcess);

      return testFn(req, (err, res) => {
        if (err) {
          throw err;
        }
        res.status.should.be.exactly(400);
        res.body.error.should.be.exactly('invalid script');
      });
    });
  });

  describe('GET "/<process>/remove"', () => {
    it('removes an existing process and renders the updated list of processes', () => {
      const req = supertest(server).get(`/${process.name}/remove`);
      return testFn(req, (err, res) => {
        if (err) {
          throw err;
        }
        res.status.should.be.exactly(200);
        const processes = res.body;
        processes.length.should.be.exactly(0);
        processes.should.be.an.Array();
      });
    });

    it('renders an error if the process does not exist', () => {
      const req = supertest(server).get('/doesnotexist/remove');
      return testFn(req, (err, res) => {
        if (err) {
          throw err;
        }
        res.status.should.be.exactly(404);
      });
    });
  });

  describe('POST "/<process>/segments"', () => {
    it('renders the first segment', () => {
      const req = supertest(server)
        .post(`/${process.name}/segments`)
        .send([1, 2, 3]);
      return testFn(req, (err, res) => {
        if (err) {
          throw err;
        }
        res.status.should.be.exactly(200);
        const segment = res.body;
        segment.link.state.should.deepEqual({ a: 1, b: 2, c: 3 });
        segment.link.meta.mapId.should.be.a.String();
        segment.meta.linkHash.should.be.exactly(hashJson(segment.link));
        segment.meta.evidence.should.deepEqual({ state: 'QUEUED' });
      });
    });

    it('updates correclty when adding a process after initial launch', () => {
      const p2 = agent.addProcess('basic2', actions, memoryStore(), null);
      const req = supertest(server)
        .post(`/${p2.name}/segments`)
        .send([1, 2, 3]);
      return testFn(req, (err, res) => {
        if (err) {
          throw err;
        }
        res.status.should.be.exactly(200);
        const segment = res.body;
        segment.link.state.should.deepEqual({ a: 1, b: 2, c: 3 });
        segment.link.meta.mapId.should.be.a.String();
        segment.meta.linkHash.should.be.exactly(hashJson(segment.link));
      });
    });

    it('fails when trying to add segments to a non-existing process', () => {
      const req = supertest(server)
        .post('/lol/segments')
        .send([1, 2, 3]);
      return testFn(req, (err, res) => {
        if (err) {
          throw err;
        }
        res.status.should.be.exactly(404);
      });
    });
  });

  describe('POST "/<process>/segments/:linkHash/:action"', () => {
    it('renders the new segment', () =>
      process.createMap(1, 2, 3).then(segment1 => {
        const req = supertest(server)
          .post(`/${process.name}/segments/${segment1.meta.linkHash}/action`)
          .send([4]);
        return testFn(req, (err, res) => {
          if (err) {
            throw err;
          }
          res.status.should.be.exactly(200);
          const segment2 = res.body;
          segment2.link.state.should.deepEqual({ a: 1, b: 2, c: 3, d: 4 });
          segment2.link.meta.prevLinkHash.should.be.exactly(
            segment1.meta.linkHash
          );
          segment2.meta.linkHash.should.be.exactly(hashJson(segment2.link));
          segment2.meta.evidence.should.deepEqual({ state: 'QUEUED' });
        });
      }));
  });

  describe('GET "/<process>/segments/:linkHash"', () => {
    it('renders the segment', () =>
      process
        .createMap(1, 2, 3)
        .then(segment =>
          testDeepEquals(
            supertest(server).get(
              `/${process.name}/segments/${segment.meta.linkHash}`
            ),
            200,
            segment
          )
        ));
  });

  describe('GET "/<process>/segments"', () => {
    it('renders the segments', () =>
      process
        .createMap(1, 2, 3)
        .then(segment =>
          process.createSegment(segment.meta.linkHash, 'action', 4)
        )
        .then(() => process.findSegments({ limit: 20 }))
        .then(segments =>
          testDeepEquals(
            supertest(server).get(`/${process.name}/segments?limit=20`),
            200,
            segments
          )
        ));

    it('filters by mapIds', () => {
      let mapId;
      return process
        .createMap(1, 2, 3)
        .then(segment1 =>
          process.createSegment(segment1.meta.linkHash, 'action', 4)
        )
        .then(() =>
          process.createMap(4, 5, 6).then(segment2 => {
            ({ mapId } = segment2.link.meta);
            return process.findSegments({ mapIds: [mapId] });
          })
        )
        .then(segments =>
          testDeepEquals(
            supertest(server).get(
              `/${process.name}/segments?limit=20&mapIds=${mapId}`
            ),
            200,
            segments
          )
        );
    });
  });

  describe('GET "/<process>/maps"', () => {
    it('renders the map IDs', () =>
      process
        .createMap(1, 2, 3)
        .then(() => process.createMap(4, 5, 6))
        .then(() => process.createMap(7, 8, 9))
        .then(() => process.getMapIds(process.name, { limit: 20 }))
        .then(mapIds =>
          testDeepEquals(
            supertest(server).get(`/${process.name}/maps?limit=20`),
            200,
            mapIds
          )
        ));
  });

  describe('POST "/evidence/:linkHash"', () => {
    it('renders the updated segment', () =>
      process.createMap(1, 2, 3).then(segment1 => {
        const secret = generateSecret(segment1.meta.linkHash, '');
        return process
          .insertEvidence(segment1.meta.linkHash, { test: true }, secret)
          .then(segment2 =>
            testDeepEquals(
              supertest(server)
                .post(
                  `/${process.name}/evidence/${segment1.meta
                    .linkHash}?secret=${secret}`
                )
                .send({ test: true }),
              200,
              segment2
            )
          );
      }));
  });

  describe('GET /404', () => {
    it('renders an error', () =>
      testDeepEquals(supertest(server).get('/404'), 404, {
        status: 404,
        error: 'not found'
      }));
  });
});
