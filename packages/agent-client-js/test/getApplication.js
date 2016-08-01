// Deprecated.
import getApplication from '../src/getApplication';
import config from '../src/config';
import agentHttpServer from './utils/agentHttpServer';

config.applicationUrl = 'http://localhost:3333';

describe('#getApplication', () => {

  let closeServer;
  beforeEach(() => agentHttpServer(3333).then(c => { closeServer = c; }));
  afterEach(() => closeServer());

  it('loads an application', () =>
    getApplication('test')
      .then(agent => {
        agent.storeInfo.adapter.name.should.be.exactly('memory');
      })
  );

});
