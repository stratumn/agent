import getApplication from '../src/getApplication';

describe('#getBranches', () => {

  let app;

  beforeEach(() =>
    getApplication('sdk-test').then(res => { app = res; })
  );

  it('gets the branches', () =>
    app
      .getBranches('9f0dec64d62e946ff8')
      .then(res => {
        res.length.should.be.exactly(3);
      })
  );

  it('can filter by tag', () =>
    app
      .getBranches('1fb63515f8e', ['random', 'test'])
      .then(res => {
        res.length.should.be.exactly(1);
      })
  );

  it('returns loadable links', () =>
    app
      .getBranches('9f0dec64d62e946ff8')
      .then(res => {
        res.forEach(link => link.load.should.be.a.Function());
      })
  );

});
