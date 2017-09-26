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
import setUpData from './utils/testSetUp';
import { withData } from 'leche';

describe('#processify', () => {

  withData(setUpData(), objectOrUrl => {

    it('adds the helper functions to the process', () =>
      getAgent(objectOrUrl)
        .then(agent => {
          const testProcess = agent.processes.first_process;
          if (typeof objectOrUrl === 'string') {
            testProcess.agentUrl.should.be.exactly('http://localhost:3333');
            testProcess.prefixUrl.should.be.exactly('http://localhost:3333/first_process');
          }
          testProcess.createMap.should.be.a.Function();
          testProcess.getSegment.should.be.a.Function();
          testProcess.findSegments.should.be.a.Function();
          testProcess.getMapIds.should.be.a.Function();
          testProcess.getBranches.should.be.a.Function();
          testProcess.getLink.should.be.a.Function();
          testProcess.getMap.should.be.a.Function();
        })
    );

  });

});
