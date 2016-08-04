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

import hashJson from '../src/hashJson';

describe('#hashJson()', () => {
  it('returns a sha2-256 hash', () => {
    hashJson({ test: true }).should.be.exactly(
      '6fd977db9b2afe87a9ceee48432881299a6aaf83d935fbbe83007660287f9c2e'
    );
  });

  it('returns a canonical hash', () => {
    hashJson({ a: 1000, b: null }).should.be.exactly(hashJson({ b: null, a: 1e3 }));
  });
});
