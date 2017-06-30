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
