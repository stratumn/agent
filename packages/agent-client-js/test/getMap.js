import getApplication from '../src/getApplication';

describe('#getMap', () => {

  let app;

  beforeEach(() =>
    getApplication('sdk-test').then(res => { app = res; })
  );

  it('gets a map', () =>
    app
      .getMap('57277b34b25789323e1099fc')
      .then(res => {
        res.length.should.be.exactly(3);
      })
  );

  it('can filter by tag', () =>
    app
      .getMap('57277b34b25789323e1099fc', ['random', 'test'])
      .then(res => {
        res.length.should.be.exactly(1);
      })
  );

  it('returns loadable links', () =>
    app
      .getMap('57277b34b25789323e1099fc')
      .then(res => {
        res.forEach(link => link.load.should.be.a.Function());
      })
  );

});
