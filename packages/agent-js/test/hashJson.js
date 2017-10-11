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

import hashJson from '../src/hashJson';

describe('#hashJson()', () => {
  it('returns a sha2-256 hash', () => {
    hashJson({ test: true }).should.be.exactly(
      '6fd977db9b2afe87a9ceee48432881299a6aaf83d935fbbe83007660287f9c2e'
    );
  });

  it('returns a canonical hash', () => {
    hashJson({ a: 1000, b: null }).should.be.exactly(
      hashJson({ b: null, a: 1e3 })
    );
  });
});
