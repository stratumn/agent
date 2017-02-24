/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import makeQueryString from '../src/makeQueryString';

describe('#makeQueryString()', () => {
  it('returns a query string', () => {
    makeQueryString({ a: 'test', b: true }).should.be.exactly('?a=test&b=true');
  });

  it('returns an empty string if passed an empty object', () => {
    makeQueryString({}).should.be.exactly('');
  });

  it('joins array elements with a comma', () => {
    makeQueryString({ a: [1, 2, 'three'] }).should.be.exactly('?a=1%2B2%2Bthree');
  });
});
