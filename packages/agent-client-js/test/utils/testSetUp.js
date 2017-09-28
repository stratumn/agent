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
import { testAgent, agentHttpServer } from './agentHttpServer';
import { withData } from 'leche';

const port = 3333;
const agentUrl = `http://localhost:${port}`;
let agentObj = 'http://not/a/url';
let closeServer;

// will run before each 'it' test
beforeEach(() => {agentObj = testAgent(port);});
beforeEach(() => agentHttpServer(agentObj, port).then(c => { closeServer = c; }));
afterEach(() => {closeServer();});

// defines the dataset over which to run all the tests
// 1/ with an object agent
// 2/ with a url pointing at a server agent
// note that the data in the dataset is given as callbacks
// this is because the leche withData function is evaluated
// before beforeEach functions, hence the only way to delay
// the retrieval of agentObj and agentUrl is to provide a callback
const setUpData = {
  'agent object': [() => agentObj],
  'agent url': [() => agentUrl]
};

// will execute testFunction over each entry of the dataset
// see https://github.com/box/leche
const runTestsWithData = testFunction => {
  withData(setUpData, testFunction);
};

// will execute testFunction over each entry of the dataset
// providing the process directly as a callback (avoids having
// to duplicate this logic everywhere in the tests)
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
  runTestsWithDataAndAgent
};
