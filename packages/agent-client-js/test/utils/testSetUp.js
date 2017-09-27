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
import getAgent from '../../src/getAgent';
import { dummyAgent, _agentHttpServer } from './agentHttpServer';
import { withData } from 'leche';

const port = 3333;
const agentUrl = `http://localhost:${port}`;
let agentObj = 'http://not/a/url';
let closeServer;

beforeEach(() => {agentObj = dummyAgent(port);});
beforeEach(() => _agentHttpServer(agentObj, port).then(c => { closeServer = c; }));
afterEach(() => {closeServer();});

const setUpData = () => {
  const res = {
    'agent object': [() => agentObj],
    'agent url': [() => agentUrl]
  };
  return res;
};

const runTestsWithData = testFunction => {
  withData(setUpData(), testFunction);
};

const runTestsWithDataAndAgent = testFunction => {
  runTestsWithData(objectOrUrlCb => {
    let agent;
    let process;
    beforeEach(() =>
      getAgent(objectOrUrlCb()).then(res => {
        agent = res;
        process = agent.processes.first_process;
        return;
      })
    );
    testFunction(() => process);
  });
};

module.exports = {
  runTestsWithData,
  runTestsWithDataAndAgent,
  setUpData
};
