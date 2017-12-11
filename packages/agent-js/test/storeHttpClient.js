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
import should from 'should';
import storeHttpClient, {
  getAvailableStores,
  clearAvailableStores
} from '../src/storeHttpClient';
import mockStoreHttpServer from './utils/mockStoreHttpServer';

mockStoreHttpServer(mocker(request));

describe('StoreHttpClient', () => {
  describe('#getAvailableStores()', () => {
    beforeEach(() => {
      clearAvailableStores();
    });

    it('tracks store clients that are created', () => {
      storeHttpClient('http://store1:5000');
      storeHttpClient('http://store2:5001');

      getAvailableStores().length.should.be.exactly(2);
      getAvailableStores()[0].url.should.be.exactly('http://store1:5000');
      getAvailableStores()[1].url.should.be.exactly('http://store2:5001');
    });

    it('does not create duplicate stores for the same url', () => {
      const storeClient1 = storeHttpClient('http://store:5000');
      const storeClient2 = storeHttpClient('http://store:5000');

      getAvailableStores().length.should.be.exactly(1);
      storeClient1.should.equal(storeClient2);
    });
  });

  describe('#getInfo()', () => {
    it('resolves with the store info', () =>
      storeHttpClient('http://localhost')
        .getInfo()
        .then(body => body.should.deepEqual({ name: 'mock' })));
  });

  describe('#createLink()', () => {
    it('resolves with the segment', () =>
      storeHttpClient('http://localhost')
        .createLink({
          state: { test: true },
          meta: { process: 'test' }
        })
        .then(body =>
          body.should.deepEqual({
            link: {
              state: { test: true },
              meta: { process: 'test' }
            },
            meta: {
              linkHash: 'linkHash'
            }
          })
        ));
  });

  describe('#getSegment()', () => {
    it('resolves with the segment', () =>
      storeHttpClient('http://localhost')
        .getSegment('test', 'linkHash')
        .then(body => {
          body.should.be.an.Object();
          body.should.deepEqual({
            meta: { linkHash: 'linkHash?process=test' },
            link: { state: { query: '', filtered: 0 } }
          });
        }));

    it('rejects if there is an error', () =>
      storeHttpClient('http://localhost')
        .getSegment('test', 'notFound')
        .then(() => {
          throw new Error('should not resolve');
        })
        .catch(err => {
          err.statusCode.should.be.exactly(404);
          err.message.should.be.exactly('not found');
        }));
  });

  describe('#findSegments()', () => {
    it('resolves with the segments', () =>
      storeHttpClient('http://localhost')
        .findSegments('test')
        .then(body => {
          body.should.be.an.Array();
          body.length.should.be.exactly(2);
        }));

    it('sends a query', () =>
      storeHttpClient('http://localhost')
        .findSegments('one', {
          mapId: 'map',
          prevLinkHash: 'hash',
          tags: ['tag1', 'tag2'],
          linkHashes: ['segment2', 'segment3'],
          offset: 20,
          limit: 10
        })
        .then(body => {
          body.should.be.an.Array();
          body.length.should.be.exactly(1);
          body[0].link.state.query.should.be.exactly(
            'process=one&mapId=map&prevLinkHash=hash' +
              '&tags%5B%5D=tag1&tags%5B%5D=tag2' +
              '&linkHashes%5B%5D=segment2&linkHashes%5B%5D=segment3' +
              '&offset=20&limit=10'
          );
        }));
  });

  describe('#getMapIds()', () => {
    it('resolves with the map IDs', () =>
      storeHttpClient('http://localhost')
        .getMapIds('test')
        .then(body => {
          body.should.be.an.Array();
          body.length.should.be.exactly(1);
          should(body[0]).deepEqual({
            meta: { process: 'test' },
            query: 'process=test'
          });
        }));

    it('sends a query', () =>
      storeHttpClient('http://localhost')
        .getMapIds('test', { offset: 20, limit: 10 })
        .then(body => {
          body.should.be.an.Array();
          body.length.should.be.exactly(1);
          should(body[0].query).be.exactly('process=test&offset=20&limit=10');
        }));
  });
});
