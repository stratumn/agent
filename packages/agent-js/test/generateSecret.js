import generateSecret from '../src/generateSecret';

describe('#generateSecret()', () => {
  it('returns a string', () => {
    generateSecret('hello', 'world').should.be.a.String();
  });
});
