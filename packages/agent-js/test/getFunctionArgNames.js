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
