import getApplication from '../src/getApplication';

describe('#getLink', () => {

  let app;

  beforeEach(() =>
    getApplication('sdk-test').then(res => { app = res; })
  );

  it('gets a link', () =>
    app
      .getLink('9f0dec64d62e946ff8')
      .then(res => {
        res.link.state.title.should.be.exactly('test');
      })
  );

});
