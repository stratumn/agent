import getApplication from '../src/getApplication';

describe('#createMap', () => {

  let app;

  beforeEach(() =>
    getApplication('sdk-test').then(res => { app = res; })
  );

  it('creates a map', () =>
    app
      .createMap('Test')
      .then(res => {
        res.link.state.title.should.be.exactly('Test');
      })
  );

});
