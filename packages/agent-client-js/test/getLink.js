import getApplication from '../src/getApplication';

describe('#getLink', () => {

  let app;

  beforeEach(() =>
    getApplication('quickstart').then(res => { app = res; })
  );

  it('gets a link', () =>
    app
      .getLink('338183e36e024b0f0370e93a1e54d424a584599cac8b08d7abd758eaabd8bcf7')
      .then(res => {
        res.link.state.title.should.be.exactly('Test');
      })
  );

});
