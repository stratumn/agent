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
import storeHttpClient from '../src/storeHttpClient';
import mockStoreHttpServer from './utils/mockStoreHttpServer';

mockStoreHttpServer(mocker(request));

describe('StoreHttpClient', () => {
  describe('#getInfo()', () => {
    it('resolves with the store info', () =>
      storeHttpClient('http://localhost')
        .getInfo()
        .then(body => body.should.deepEqual({ name: 'mock' }))
    );
  });

  describe('#saveSegment()', () => {
    it('resolves with the segment', () =>
      storeHttpClient('http://localhost')
        .saveSegment({ link: { state: { test: true } } })
        .then(body => body.should.deepEqual({ link: { state: { test: true } } }))
    );
  });

  describe('#getSegment()', () => {
    it('resolves with the segment', () =>
      storeHttpClient('http://localhost')
        .getSegment('test')
        .then(body => body.should.deepEqual({ meta: { linkHash: 'test' } }))
    );

    it('rejects if there is an error', () =>
      storeHttpClient('http://localhost')
        .getSegment('notFound')
        .then(() => { throw new Error('should not resolve'); })
        .catch(err => {
          err.statusCode.should.be.exactly(404);
          err.message.should.be.exactly('not found');
        })
    );
  });

  describe('#deleteSegment()', () => {
    it('resolves with the deleted segment', () =>
      storeHttpClient('http://localhost')
        .deleteSegment('test')
        .then(body => body.should.deepEqual({ meta: { linkHash: 'test' } }))
    );
  });

  describe('#findSegments()', () => {
    it('resolves with the segments', () =>
      storeHttpClient('http://localhost')
        .findSegments()
        .then(body => body.should.deepEqual([{ link: { state: { query: '' } } }]))
    );

    it('sends a query', () =>
      storeHttpClient('http://localhost')
        .findSegments({
          mapId: 'map',
          prevLinkHash: 'hash',
          tags: ['tag1', 'tag2'],
          offset: 20,
          limit: 10
        })
        .then(body => body[0].link.state.query.should.be.exactly(
          'mapId=map&prevLinkHash=hash&tags=tag1%2Btag2&offset=20&limit=10'
        ))
    );
  });

  describe('#getMapIds()', () => {
    it('resolves with the map IDs', () =>
      storeHttpClient('http://localhost')
        .getMapIds()
        .then(body => body.should.deepEqual(['mapId']))
    );

    it('sends a query', () =>
      storeHttpClient('http://localhost')
        .getMapIds({ offset: 20, limit: 10 })
        .then(body => body[0].should.be.exactly('offset=20&limit=10'))
    );
  });
});
