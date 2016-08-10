import getAgent from '../src/getAgent';
import agentHttpServer from './utils/agentHttpServer';

describe('#getMap', () => {

  let closeServer;
  beforeEach(() => agentHttpServer(3333).then(c => { closeServer = c; }));
  afterEach(() => closeServer());

  let agent;
  beforeEach(() =>
    getAgent('http://localhost:3333').then(res => { agent = res; })
  );

  // Deprecated
  it('finds the segments', () =>
    agent
      .createMap('hi')
      .then(segment => segment.addMessage('hello', 'bot'))
      .then(segment => agent.getMap(segment.link.meta.mapId))
      .then(segments => {
        segments.should.be.an.Array();
        segments.length.should.be.exactly(2);
      })
  );

});
