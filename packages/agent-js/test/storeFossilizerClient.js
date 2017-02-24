/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import request from 'superagent';
import mocker from 'superagent-mocker';
import fossilizerHttpClient from '../src/fossilizerHttpClient';
import mockFossilizerHttpServer from './utils/mockFossilizerHttpServer';

mockFossilizerHttpServer(mocker(request));

describe('FossilizerHttpClient', () => {
  describe('#getInfo()', () => {
    it('resolves with the fossilizer info', () =>
      fossilizerHttpClient('http://localhost')
        .getInfo()
        .then(body => body.should.deepEqual({ name: 'mock' }))
    );
  });

  describe('#fossilize()', () => {
    it('resolves with the response', () =>
      fossilizerHttpClient('http://localhost')
        .fossilize('Hello, World!', 'http://localhost:3333')
        .then(body => body.should.deepEqual({
          data: 'Hello, World!',
          callbackUrl: 'http://localhost:3333'
        }))
    );
  });
});
