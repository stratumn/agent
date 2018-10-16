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

import request from 'superagent';
import mocker from 'superagent-mocker';
import fossilizerHttpClient from '../src/fossilizerHttpClient';
import mockFossilizerHttpServer from './utils/mockFossilizerHttpServer';

const fossilizerClient = fossilizerHttpClient('http://localhost');

mockFossilizerHttpServer(mocker(request));

describe('FossilizerHttpClient', () => {
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
});
