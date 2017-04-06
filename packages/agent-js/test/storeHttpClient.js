/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
        .then(body =>
          body.should.deepEqual({ name: 'mock' })
        )
    );
  });

  describe('#saveSegment()', () => {
    it('resolves with the segment', () =>
      storeHttpClient('http://localhost')
        .saveSegment({ link: { state: { test: true } } })
        .then(body =>
          body.should.deepEqual({ link: { state: { test: true } } })
        )
    );
  });

  describe('#getSegment()', () => {
    it('resolves with the segment', () =>
      storeHttpClient('http://localhost')
        .getSegment('test')
        .then(body =>
          body.should.deepEqual({ meta: { linkHash: 'test' } })
        )
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

    it('applies the filters', () =>
      storeHttpClient('http://localhost')
        .getSegment('test', [segment => (segment.meta.linkHash !== 'test')])
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
        .then(body =>
          body.should.deepEqual({ meta: { linkHash: 'test' } })
        )
    );
  });

  describe('#findSegments()', () => {
    it('resolves with the segments', () =>
      storeHttpClient('http://localhost')
        .findSegments()
        .then(body => {
          body.should.have.length(2);
          body[0].should.deepEqual({ link: { state: { query: '', filtered: 0 } } });
        })
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
        .then(body =>
          body[0].link.state.query.should.be.exactly(
          'mapId=map&prevLinkHash=hash&tags=tag1%2Btag2&offset=20&limit=10')
        )
    );

    it('applies the filters', () =>
      storeHttpClient('http://localhost')
        .findSegments(null, [segment => segment.link.state.filtered === 1])
        .then(body => {
          body.should.have.length(1);
          body[0].link.state.filtered.should.be.exactly(1);
        })
    );
  });

  describe('#getMapIds()', () => {
    it('resolves with the map IDs', () =>
      storeHttpClient('http://localhost')
        .getMapIds()
        .then(body => {
          body.should.deepEqual(['mapId']);
        })
    );

    it('sends a query', () =>
      storeHttpClient('http://localhost')
        .getMapIds({ offset: 20, limit: 10 })
        .then(body => {
          body[0].should.be.exactly('offset=20&limit=10');
        })
    );
  });
});
