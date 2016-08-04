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
