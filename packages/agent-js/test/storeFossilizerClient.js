/*
    Stratumn Agent Javascript Library
    Copyright (C) 2016  Stratumn SAS

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
