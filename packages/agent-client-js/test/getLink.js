import getAgent from '../src/getAgent';
import agentHttpServer from './utils/agentHttpServer';

describe('#getLink', () => {

  let closeServer;
  beforeEach(() => agentHttpServer(3333).then(c => { closeServer = c; }));
  afterEach(() => closeServer());

  let agent;
  beforeEach(() =>
    getAgent('http://localhost:3333').then(res => { agent = res; })
  );

  // Deprecated
  it('gets a segment', () =>
    agent
      .createMap('hi there')
      .then(segment =>
        agent.getLink(segment.meta.linkHash)
      )
      .then(segment => {
        segment.link.state.title.should.be.exactly('hi there');
      })
  );

});
