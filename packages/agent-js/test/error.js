import error from '../src/error';

// TODO: tests
describe('#error()', () => {
  it('returns a function', () => {
    error().should.be.a.Function();
  });
});
