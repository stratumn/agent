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
