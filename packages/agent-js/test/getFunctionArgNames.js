/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
