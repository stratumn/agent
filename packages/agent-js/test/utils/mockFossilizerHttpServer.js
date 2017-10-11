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

export default function mockFossilizerHttpServer(mock, process) {
  let result;
  mock.get('http://localhost', () => ({
    status: 200,
    body: { name: 'mock' }
  }));

  mock.post('http://localhost/fossils', req => {
    if (req.body.callbackUrl.indexOf('=') > 0) {
      const secret = req.body.callbackUrl.substr(
        req.body.callbackUrl.indexOf('=') + 1
      );
      return process
        .insertEvidence(req.body.data, { mockEvidence: result }, secret)
        .then(() => ({
          status: 200,
          body: req.body
        }));
    }
    return {
      status: 200,
      body: req.body
    };
  });
}
