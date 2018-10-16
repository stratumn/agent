/*
  Copyright 2016-2018 Stratumn SAS. All rights reserved.

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
import { runTestsWithData } from './utils/testSetUp';

describe('#getAgent', () => {
  runTestsWithData(objectOrUrlCb => {
    it('loads an agent', () =>
      getAgent(objectOrUrlCb()).then(agent => {
        if (typeof objectOrUrlCb() === 'string') {
          agent.url.should.be.exactly('http://localhost:3333');
        }
        Object.keys(agent.processes).length.should.be.exactly(3);
        agent.processes.first_process.storeInfo.adapter.name.should.be.exactly(
          'memory'
        );
      }));

    it('loads an agent if the url has an extra "/" at the end', () => {
      const url = 'http://localhost:3333/';
      return getAgent(url).then(agent => {
        agent.url.should.be.exactly('http://localhost:3333/');
        Object.keys(agent.processes).length.should.be.exactly(3);
        agent.processes.first_process.storeInfo.adapter.name.should.be.exactly(
          'memory'
        );
      });
    });

    it('fails to load an agent', () =>
      getAgent()
        .then(() => {
          throw new Error('Should not get an agent...');
        })
        .catch(err => {
          err.message.should.be.exactly(
            'The argument passed is neither a url or an object!'
          );
        }));
  });
});
