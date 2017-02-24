/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
