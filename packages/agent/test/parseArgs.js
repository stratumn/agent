/*
  Copyright 2018 Stratumn SAS. All rights reserved.

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

import parseArgs from '../src/parseArgs';

describe('#parseArgs()', () => {
  it('returns an empty array if body is falsy', () => {
    const res = parseArgs();
    res.should.be.an.Array();
    res.length.should.be.exactly(0);
  });

  it('returns an empty array if body is an empty object', () => {
    const res = parseArgs({});
    res.should.be.an.Array();
    res.length.should.be.exactly(0);
  });

  it('returns the body if it is an array', () => {
    const body = [];
    parseArgs(body).should.be.exactly(body);
  });

  it('wraps body in an array if it is an non empty object', () => {
    const body = { test: true };
    parseArgs(body).should.deepEqual([body]);
  });
});
