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

import getAgent from '../src/getAgent';
import agentHttpServer from './utils/agentHttpServer';

describe('#findSegments', () => {

  let closeServer;
  beforeEach(() => agentHttpServer(3333).then(c => { closeServer = c; }));
  afterEach(() => closeServer());

  let agent;
  let process;
  beforeEach(() =>
    getAgent('http://localhost:3333').then(res => {
      agent = res;
      process = agent.processes.first_process;
      return;
    })
  );

  it('finds the segments', () =>
    process
      .createMap('hi')
      .then(() => process.createMap('hi'))
      .then(() => process.findSegments())
      .then(segments => {
        segments.should.be.an.Array();
        segments.length.should.be.exactly(2);
      })
  );

  it('applies the options mapId', () =>
    process
      .createMap('hi')
      .then(() => process.createMap('hi'))
      .then(segment => process.findSegments({ mapIds: [segment.link.meta.mapId] }))
      .then(segments => {
        segments.should.be.an.Array();
        segments.length.should.be.exactly(1);
      })
  );

  it('loads all segments with a limit of -1', () =>
    process
      .createMap('hi')
      .then(() => process.createMap('hi'))
      .then(() => process.findSegments({ limit: -1, batchSize: 1 }))
      .then(segments => {
        segments.should.be.an.Array();
        segments.length.should.be.exactly(2);
      })
  );

  it('loads all segments with a limit of -1', () =>
    process
      .createMap('hi')
      .then(() => process.createMap('hi'))
      .then(() => process.findSegments({ limit: -1, batchSize: 2 }))
      .then(segments => {
        segments.should.be.an.Array();
        segments.length.should.be.exactly(2);
      })
  );

  it('returns segmentified segments', () =>
    process
      .createMap('hi')
      .then(() => process.createMap('hi'))
      .then(() => process.findSegments())
      .then(segments => {
        segments.forEach(segment => segment.getPrev.should.be.a.Function());
      })
  );

});
