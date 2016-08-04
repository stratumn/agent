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

import getFunctionArgNames from '../src/getFunctionArgNames';

describe('#getFunctionArgNames()', () => {
  it('returns the argument names of a function', () => {
    getFunctionArgNames((a, b, c) => ({ a, b, c })).should.deepEqual(['a', 'b', 'c']);
  });

  it('works if the function has comments', () => {
    /**
     * A test function.
     */
    function test(a, b, c) {
      // Return the arguments.
      return { a, b, c };
    }

    getFunctionArgNames(test).should.deepEqual(['a', 'b', 'c']);
  });
});
