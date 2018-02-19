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

import superRequest from 'superagent';
import mocker from 'superagent-mocker';
import should from 'should';
import supertest from 'supertest';
import create from '../src/create';
import memoryStore from '../src/memoryStore';
import hashJson from '../src/hashJson';
import plugins from '../src/plugins';
import actions from './utils/basicActions';
import mockStoreHttpServer from './utils/mockStoreHttpServer';
import refs from './utils/refs';

function makePostRequest(server, url, args) {
  return supertest(server)
    .post(url)
    .send(args);
}

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
    agent = create({
      agentUrl: 'http://localhost'
    });
    mockFossilizer = {
      fossilize() {
        return Promise.resolve(true);
      },

      getInfo() {
        return Promise.resolve(true);
      },

      connect() {},
      on() {}
    };
    process = agent.addProcess('basic', actions, memoryStore(), mockFossilizer);
    server = agent.httpServer();
  });

  describe('GET "/"', () => {
    it('renders the agent info', () => {
      process.fossilizerClients = null;
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

  describe('POST "/<process>/upload"', () => {
    const validEncodedActions = Buffer.from(
      'module.exports = { ' +
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

    let serverWithProcessUpload;

    beforeEach(() => {
      mockStoreHttpServer(mocker(superRequest));
      serverWithProcessUpload = agent.httpServer({ enableProcessUpload: true });
    });

    const createRequest = (
      encodedActions = validEncodedActions,
      store = { url: 'http://localhost' },
      fossilizers = [],
      pluginIds = []
    ) => ({
      actions: encodedActions,
      store: store,
      fossilizers: fossilizers,
      plugins: pluginIds.map(id => ({ id }))
    });

    const uploadProcessAndValidate = (
      testServer,
      request,
      validate,
      processName = 'newProcess'
    ) => {
      const req = supertest(testServer)
        .post(`/${processName}/upload`)
        .send(request);

      return testFn(req, (err, res) => {
        if (err) {
          throw err;
        }

        validate(res);
      });
    };

    it('is disabled by default', () =>
      uploadProcessAndValidate(server, createRequest(), res => {
        res.status.should.be.exactly(404);
      }));

    it('adds a new process and returns the updated list of processes', () =>
      uploadProcessAndValidate(
        serverWithProcessUpload,
        createRequest(),
        res => {
          res.status.should.be.exactly(200);
          const processes = res.body;
          processes.length.should.be.exactly(2);
          processes[1].name.should.be.exactly('hot');
        },
        'hot'
      ));

    it('supports store and fossilizers', () => {
      const request = createRequest(
        validEncodedActions,
        { url: 'http://localhost' },
        [
          {
            url: 'http://localhost'
          },
          {
            url: 'http://localhost'
          }
        ]
      );

      return uploadProcessAndValidate(
        serverWithProcessUpload,
        request,
        res => {
          res.status.should.be.exactly(200);
          const newProcess = res.body.find(p => p.name === 'withStore');
          newProcess.should.not.be.empty();
          newProcess.storeInfo.should.not.be.empty();
          newProcess.fossilizersInfo.length.should.be.exactly(2);
        },
        'withStore'
      );
    });

    it('supports plugin configuration', () => {
      // Setup some initial plugins on the agent
      agent.addProcess('initialPlugins', actions, memoryStore(), null, {
        plugins: [plugins.stateHash, plugins.localTime]
      });

      const request = createRequest(
        validEncodedActions,
        { url: 'http://localhost' },
        [],
        ['2'] /* plugin ids start at 1 - id=2 is localTime here */
      );

      return uploadProcessAndValidate(
        serverWithProcessUpload,
        request,
        res => {
          res.status.should.be.exactly(200);
          const newProcess = res.body.find(p => p.name === 'withPlugins');
          newProcess.processInfo.pluginsInfo.length.should.be.exactly(1);
          newProcess.processInfo.pluginsInfo[0].name.should.be.exactly(
            plugins.localTime.name
          );
        },
        'withPlugins'
      );
    });

    it('rejects process with missing actions', () =>
      uploadProcessAndValidate(
        serverWithProcessUpload,
        createRequest(''),
        res => {
          res.status.should.be.exactly(400);
          res.body.error.should.be.exactly('missing actions');
        }
      ));

    it('rejects process with no exported init function', () => {
      const missingFunctions = Buffer.from(
        "module.exports = { useless:'dummy'};"
      ).toString('base64');

      return uploadProcessAndValidate(
        serverWithProcessUpload,
        createRequest(missingFunctions),
        res => {
          res.status.should.be.exactly(400);
          res.body.error.should.be.exactly('missing init function');
        }
      );
    });

    it('rejects process with invalid actions script', () => {
      const invalidActions = 'this is definitely not a valid script';
      return uploadProcessAndValidate(
        serverWithProcessUpload,
        createRequest(invalidActions),
        res => {
          res.status.should.be.exactly(400);
          res.body.error.should.be.exactly('invalid actions');
        }
      );
    });

    it('rejects process with missing store configuration', () => {
      const request = createRequest(validEncodedActions, { url: '' });
      return uploadProcessAndValidate(serverWithProcessUpload, request, res => {
        res.status.should.be.exactly(400);
        res.body.error.should.be.exactly('missing store url');
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
      const req = makePostRequest(server, `/${process.name}/segments`, [
        [],
        [],
        1,
        2,
        3
      ]);
      return testFn(req, (err, res) => {
        if (err) {
          throw err;
        }
        res.status.should.be.exactly(200);
        const segment = res.body;
        segment.link.state.should.deepEqual({ a: 1, b: 2, c: 3 });
        segment.link.meta.mapId.should.be.a.String();
        segment.meta.linkHash.should.be.exactly(hashJson(segment.link));
        return should(segment.meta.evidences.should.deepEqual([]));
      });
    });

    it('renders the first segment with good refs', () => {
      const req = makePostRequest(server, `/${process.name}/segments`, [
        [],
        refs.getValidRefs(process.name),
        1,
        2,
        3
      ]);
      return testFn(req, (err, res) => {
        if (err) {
          throw err;
        }
        res.status.should.be.exactly(200);
        const segment = res.body;
        segment.link.state.should.deepEqual({ a: 1, b: 2, c: 3 });
        segment.link.meta.mapId.should.be.a.String();
        segment.link.meta.refs.should.be.an.Array();
        segment.link.meta.refs.length.should.be.exactly(3);
        segment.meta.linkHash.should.be.exactly(hashJson(segment.link));
        return should(segment.meta.evidences.should.deepEqual([]));
      });
    });

    it('renders the first segment with bad process ref', () => {
      const req = makePostRequest(server, `/${process.name}/segments`, [
        [],
        refs.getInvalidRefs(),
        1,
        2,
        3
      ]);
      return testFn(req, (err, res) => {
        if (err) {
          throw err;
        }
        res.status.should.be.exactly(400);
      });
    });

    it('updates correclty when adding a process after initial launch', () => {
      const p2 = agent.addProcess('basic2', actions, memoryStore(), null);
      const req = makePostRequest(server, `/${p2.name}/segments`, [
        null,
        null,
        1,
        2,
        3
      ]);
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
      const req = makePostRequest(server, '/lol/segments', [[], [], 1, 2, 3]);
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
      process.createMap([], [], 1, 2, 3).then(segment1 => {
        const req = makePostRequest(
          server,
          `/${process.name}/segments/${segment1.meta.linkHash}/action`,
          [[], [], 4]
        );
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
          segment2.meta.evidences.should.deepEqual([]);
        });
      }));
  });

  describe('GET "/<process>/segments/:linkHash"', () => {
    it('renders the segment', () =>
      process
        .createMap([], [], 1, 2, 3)
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
        .createMap([], [], 1, 2, 3)
        .then(segment =>
          process.createSegment(segment.meta.linkHash, 'action', [], [], 4)
        )
        .then(() => process.findSegments({ limit: 20 }))
        .then(segments => {
          testDeepEquals(
            supertest(server).get(`/${process.name}/segments?limit=20`),
            200,
            segments
          );
        }));

    it('filters by mapIds', () => {
      let mapId;
      return process
        .createMap([], [], 1, 2, 3)
        .then(segment1 =>
          process.createSegment(segment1.meta.linkHash, 'action', [], [], 4)
        )
        .then(() =>
          process.createMap([], [], 4, 5, 6).then(segment2 => {
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
        .createMap([], [], 1, 2, 3)
        .then(() => process.createMap([], [], 4, 5, 6))
        .then(() => process.createMap([], [], 7, 8, 9))
        .then(() => process.getMapIds(process.name, { limit: 20 }))
        .then(mapIds =>
          testDeepEquals(
            supertest(server).get(`/${process.name}/maps?limit=20`),
            200,
            mapIds
          )
        ));
  });

  describe('GET /404', () => {
    it('renders an error', () =>
      testDeepEquals(supertest(server).get('/404'), 404, {
        status: 404,
        error: 'not found'
      }));
  });
});
