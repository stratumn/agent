import getAgent from '../src/getAgent';
import agentHttpServer from './utils/agentHttpServer';

describe('#createMap', () => {

  let closeServer;
  beforeEach(() => agentHttpServer(3333).then(c => { closeServer = c; }));
  afterEach(() => closeServer());

  let agent;
  beforeEach(() =>
    getAgent('http://localhost:3333').then(res => { agent = res; })
  );

  it('creates a map', () =>
    agent
      .createMap('Test')
      .then(segment => {
        segment.link.state.title.should.be.exactly('Test');
      })
  );

  it('handles error', () =>
    agent
      .createMap()
      .then(() => {
        throw new Error('it should have failed');
      })
      .catch(err => {
        err.message.should.be.exactly('a title is required');
        err.status.should.be.exactly(400);
      })
  );

});
