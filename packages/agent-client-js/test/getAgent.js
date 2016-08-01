import getAgent from '../src/getAgent';
import agentHttpServer from './utils/agentHttpServer';

describe('#getAgent', () => {

  let closeServer;
  beforeEach(() => agentHttpServer(3333).then(c => { closeServer = c; }));
  afterEach(() => closeServer());

  it('loads an agent', () =>
    getAgent('localhost:3333')
      .then(agent => {
        agent.storeInfo.adapter.name.should.be.exactly('memory');
      })
  );

});
