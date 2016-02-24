import getApplication from '../src/getApplication';

describe('#getApplication', () => {

  it('loads an application', () =>
    getApplication('quickstart')
      .then(app => {
        app.name.should.be.exactly('quickstart');
      })
  );

});
