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
    body: [{ link: { state: { query: '' } } }]
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
