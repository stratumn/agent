import getAgent from '../src/getAgent';
import agentHttpServer from './utils/agentHttpServer';

describe('#getMapIds', () => {

  let closeServer;
  beforeEach(() => agentHttpServer(3333).then(c => { closeServer = c; }));
  afterEach(() => closeServer());

  let agent;

  beforeEach(() =>
    getAgent('http://localhost:3333').then(res => { agent = res; })
  );

  it('gets map IDs', () =>
    agent
      .createMap('hi')
      .then(() => agent.createMap('hi'))
      .then(() => agent.createMap('hi'))
      .then(() => agent.getMapIds())
      .then(mapIds => {
        mapIds.should.be.an.Array();
        mapIds.length.should.be.exactly(3);
        mapIds.forEach(mapId => mapId.should.be.a.String());
      })
  );

});
