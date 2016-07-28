import makeQueryString from '../src/makeQueryString';

describe('#makeQueryString()', () => {
  it('returns a query string', () => {
    makeQueryString({ a: 'test', b: true }).should.be.exactly('?a=test&b=true');
  });

  it('returns an empty string if passed an empty object', () => {
    makeQueryString({}).should.be.exactly('');
  });

  it('joins array elements with a comma', () => {
    makeQueryString({ a: [1, 2, 'three'] }).should.be.exactly('?a=1%2C2%2Cthree');
  });
});
