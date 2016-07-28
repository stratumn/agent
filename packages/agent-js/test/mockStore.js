import path from 'path';
import fs from 'fs';

const segment = JSON.parse(fs.readFileSync(path.resolve(__dirname, './fixtures/segment.json')));

export default function mockStore(mock) {
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
    if (req.params.linkHash === 'full') {
      return {
        status: 200,
        body: segment
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

  mock.get('http://localhost/segments?*', req => ({
    status: 200,
    body: [{ link: { state: { query: req.url.split('?')[1] } } }]
  }));

  mock.get('http://localhost/maps', () => ({
    status: 200,
    body: ['mapId']
  }));

  mock.get('http://localhost/maps?*', req => ({
    status: 200,
    body: [req.url.split('?')[1]]
  }));
}
