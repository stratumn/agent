import getAgent from '../src/getAgent';
import agentHttpServer from './utils/agentHttpServer';

describe('#getSegment', () => {

  let closeServer;
  beforeEach(() => agentHttpServer(3333).then(c => { closeServer = c; }));
  afterEach(() => closeServer());

  let agent;
  beforeEach(() =>
    getAgent('http://localhost:3333').then(res => { agent = res; })
  );

  it('gets a segment', () =>
    agent
      .createMap('hi there')
      .then(segment =>
        agent.getSegment(segment.meta.linkHash)
      )
      .then(segment => {
        segment.link.state.title.should.be.exactly('hi there');
      })
  );

});
