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

import request from 'superagent';
import mocker from 'superagent-mocker';
import create from '../src/create';
import fossilizerHttpClient, {
  getAvailableFossilizers,
  clearAvailableFossilizers
} from '../src/fossilizerHttpClient';
import mockFossilizerHttpServer from './utils/mockFossilizerHttpServer';
import memoryStore from '../src/memoryStore';
import { FOSSILIZER_DID_FOSSILIZE_LINK } from '../src/eventTypes';

const actions = {
  init(a, b, c) {
    this.append({ a, b, c });
  }
};

const fossilizerClient = fossilizerHttpClient('http://localhost');
const agent = create({ agentUrl: 'http://localhost:3000' });
const process = agent.addProcess(
  'basic',
  actions,
  memoryStore(),
  fossilizerClient,
  {
    salt: ''
  }
);

mockFossilizerHttpServer(mocker(request));

describe('FossilizerHttpClient', () => {
  describe('#getAvailableFossilizers()', () => {
    beforeEach(() => {
      clearAvailableFossilizers();
    });

    it('tracks fossilizer clients that are created', () => {
      fossilizerHttpClient('http://fossilizer1:6000');
      fossilizerHttpClient('http://fossilizer2:6001');

      getAvailableFossilizers().length.should.be.exactly(2);
      getAvailableFossilizers()[0].url.should.be.exactly(
        'http://fossilizer1:6000'
      );
      getAvailableFossilizers()[1].url.should.be.exactly(
        'http://fossilizer2:6001'
      );
    });

    it('does not create duplicate fossilizers for the same url', () => {
      const fossilizerClient1 = fossilizerHttpClient('http://fossilizer:6000');
      const fossilizerClient2 = fossilizerHttpClient('http://fossilizer:6000');

      getAvailableFossilizers().length.should.be.exactly(1);
      fossilizerClient1.should.equal(fossilizerClient2);
    });
  });

  describe('#getInfo()', () => {
    it('resolves with the fossilizer info', () =>
      fossilizerHttpClient('http://localhost')
        .getInfo()
        .then(body => body.should.deepEqual({ name: 'mock' })));
  });

  describe('#fossilize()', () => {
    it('resolves with the response', () =>
      fossilizerClient
        .fossilize('Hello, World!', 'http://localhost:3333')
        .then(body => body.should.equal('ok')));
  });

  describe('#handleMessage', () => {
    it('should save evidence when link fossilized', () => {
      const msg = {
        type: FOSSILIZER_DID_FOSSILIZE_LINK,
        data: {
          Evidence: 'yolo',
          Data: 'Z6x7OW+8Kl0tjQ==', // base64 encoded "67ac7b396fbc2a5d2d8d"
          Meta: 'dGhlUHJvY2Vzcw==' // base64 encoded "theProcess"
        }
      };
      const processes = { theProcess: process };

      const mockCalls = [];

      process.saveEvidence = (linkHash, evidence) =>
        mockCalls.push({ linkHash, evidence });

      fossilizerClient.handleMessage(msg, processes);

      mockCalls.length.should.be.exactly(1);
      mockCalls[0].linkHash.should.equal('67ac7b396fbc2a5d2d8d');
      mockCalls[0].evidence.should.equal('yolo');
    });
  });
});
