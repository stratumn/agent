import getApplication from '../src/getApplication';

describe('#getChain', () => {

  let app;

  beforeEach(() =>
    getApplication('quickstart').then(res => { app = res; })
  );

  it('gets a chain', () =>
    app
      .getChain('56d5f10ab4fa0cab73295adc')
      .then(res => {
        res.length.should.be.exactly(12);
      })
  );

  it('can filter by tag', () =>
    app
      .getChain('56d5f10ab4fa0cab73295adc', ['random', 'test'])
      .then(res => {
        res.length.should.be.exactly(2);
      })
  );

});
