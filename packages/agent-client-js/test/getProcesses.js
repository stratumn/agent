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

describe('#getProcesses', () => {

  let closeServer;
  beforeEach(() => agentHttpServer(3333).then(c => { closeServer = c; }));
  afterEach(() => closeServer());

  it('resolves with a list of all processes', () =>
    getAgent('http://localhost:3333')
      .then(agent =>
        agent.getProcesses())
      .then(processes => {
        processes.length.should.be.exactly(3);
        processes[0].name.should.be.exactly('first_process');
      })
  );

});
