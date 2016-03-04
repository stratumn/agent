import getApplication from '../src/getApplication';

describe('#getBranches', () => {

  let app;

  beforeEach(() =>
    getApplication('quickstart').then(res => { app = res; })
  );

  it('gets the branches', () =>
    app
      .getBranches('78e00b99139be04df47817bd92a76')
      .then(res => {
        res.length.should.be.exactly(10);
      })
  );

  it('can filter by tag', () =>
    app
      .getBranches('78e00b99139be04df47817bd92a76', ['random', 'test'])
      .then(res => {
        res.length.should.be.exactly(2);
      })
  );

});
