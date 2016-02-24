import getApplication from '../src/getApplication';

describe('#createChain', () => {

  let app;

  beforeEach(() =>
    getApplication('quickstart').then(res => { app = res; })
  );

  it('creates a chain', () =>
    app
      .createChain('Test')
      .then(res => {
        res.link.state.title.should.be.exactly('Test');
      })
  );

});
