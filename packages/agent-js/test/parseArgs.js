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
