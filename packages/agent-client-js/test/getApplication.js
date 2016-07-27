// Deprecated.
import getApplication from '../src/getApplication';

describe('#getApplication', () => {

  it('loads an application', () =>
    getApplication('sdk-test')
      .then(app => {
        app.name.should.be.exactly('sdk-test');
      })
  );

});
