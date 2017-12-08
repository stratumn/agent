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

import querystring from 'querystring';

export default function mockStoreHttpServer(mock) {
  mock.get('http://localhost', () => ({
    status: 200,
    body: { name: 'mock' }
  }));

  mock.post('http://localhost/links', req => {
    const link = req.body;
    if (!link.meta.process) {
      return {
        status: 403,
        statusCode: 403,
        message: "'process' is required in link.meta.process"
      };
    }

    const process = {
      link,
      meta: {
        linkHash: 'linkHash'
      }
    };

    return {
      status: 200,
      body: process
    };
  });

  mock.del('http://localhost/segments?:query', req => {
    const parsedParams = querystring.parse(req.params.query);
    if (!parsedParams.process) {
      return {
        status: 403,
        statusCode: 403,
        message: "param 'process' is required"
      };
    }
    return {
      status: 200,
      body: { meta: parsedParams }
    };
  });

  mock.get('http://localhost/segments/:linkHash', req => {
    if (req.params.linkHash === 'notFound?process=test') {
      return {
        status: 404,
        statusCode: 404,
        message: 'not found'
      };
    }
    return {
      status: 200,
      body: {
        meta: { linkHash: req.params.linkHash },
        link: { state: { query: '', filtered: 0 } }
      }
    };
  });

  mock.get('http://localhost/segments?:query', req => {
    const parsedParams = querystring.parse(req.params.query);
    if (!parsedParams.process) {
      return {
        status: 403,
        statusCode: 403,
        message: "param 'process' is required"
      };
    } else if (parsedParams.linkHash === 'notFound') {
      return {
        status: 404,
        statusCode: 404,
        message: 'not found'
      };
    } else if (parsedParams.mapId === 'map') {
      return {
        status: 200,
        body: [{ link: { state: { query: req.params.query } } }]
      };
    } else if (parsedParams.process === 'testFilter') {
      return {
        status: 200,
        body: {
          link: { state: { query: req.params.query } },
          meta: { linkHash: 'linkHash' }
        }
      };
    }
    return {
      status: 200,
      body: [
        { meta: parsedParams, link: { state: { query: '', filtered: 0 } } },
        { link: { state: { query: '', filtered: 1 } } }
      ]
    };
  });

  mock.get('http://localhost/maps?:query', req => {
    const parsedParams = querystring.parse(req.params.query);
    if (!parsedParams.process) {
      return {
        status: 403,
        statusCode: 403,
        message: "param 'process' is required"
      };
    }
    return {
      status: 200,
      body: [{ meta: parsedParams, query: req.params.query }]
    };
  });
}
