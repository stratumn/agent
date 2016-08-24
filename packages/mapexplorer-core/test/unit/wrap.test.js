import wrap from '../../src/wrap';

describe('wrap', () => {

  describe('With an array', () => {
    it('returns the array', () => {
      const array = [1, 2, 3];
      wrap(array).should.eql(array);
    });
  });

  describe('With an object', () => {
    it('returns the object wrapped in an array', () => {
      const object = 42;
      wrap(object).should.eql([object]);
    });
  });

});
