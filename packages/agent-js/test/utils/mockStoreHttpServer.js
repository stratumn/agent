/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

export default function mockStoreHttpServer(mock) {
  mock.get('http://localhost', () => ({
    status: 200,
    body: { name: 'mock' }
  }));

  mock.post('http://localhost/segments', req => ({
    status: 200,
    body: req.body
  }));

  mock.get('http://localhost/segments/:linkHash', req => {
    if (req.params.linkHash === 'notFound') {
      return {
        status: 404,
        statusCode: 404,
        message: 'not found'
      };
    }
    return {
      status: 200,
      body: { meta: { linkHash: req.params.linkHash } }
    };
  });

  mock.del('http://localhost/segments/:linkHash', req => ({
    status: 200,
    body: { meta: { linkHash: req.params.linkHash } }
  }));

  mock.get('http://localhost/segments', () => ({
    status: 200,
    body: [
      { link: { state: { query: '', filtered: 0 } } },
      { link: { state: { query: '', filtered: 1 } } }
    ]
  }));

  mock.get('http://localhost/segments?:query', req => ({
    status: 200,
    body: [{ link: { state: { query: req.params.query } } }]
  }));

  mock.get('http://localhost/maps', () => ({
    status: 200,
    body: ['mapId']
  }));

  mock.get('http://localhost/maps?:query', req => ({
    status: 200,
    body: [req.params.query]
  }));
}
