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

import makeQueryString from '../src/makeQueryString';

describe('#makeQueryString()', () => {
  it('returns a query string', () => {
    makeQueryString({ a: 'test', b: true }).should.be.exactly('?a=test&b=true');
  });

  it('returns an empty string if passed an empty object', () => {
    makeQueryString({}).should.be.exactly('');
  });

  it('uses bracket convention for arrays', () => {
    makeQueryString({ a: [1, 2, 'three'] }).should.be.exactly(
      '?a%5B%5D=1&a%5B%5D=2&a%5B%5D=three'
    );
  });
});
