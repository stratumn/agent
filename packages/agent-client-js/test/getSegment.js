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

describe('#getSegment', () => {

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

  it('gets a segment', () =>
    process
      .createMap('hi there')
      .then(segment =>
        process.getSegment(segment.meta.linkHash)
      )
      .then(segment => {
        segment.link.state.title.should.be.exactly('hi there');
      })
  );

  it('rejects if the segment is not found', () =>
    process
      .getSegment('404')
      .then(() => {
        throw new Error('should not resolve');
      })
      .catch(err => {
        err.status.should.be.exactly(404);
      })
  );

});
