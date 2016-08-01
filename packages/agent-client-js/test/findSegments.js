import getAgent from '../src/getAgent';
import agentHttpServer from './utils/agentHttpServer';

describe('#findSegments', () => {

  let closeServer;
  beforeEach(() => agentHttpServer(3333).then(c => { closeServer = c; }));
  afterEach(() => closeServer());

  let agent;
  beforeEach(() =>
    getAgent('http://localhost:3333').then(res => { agent = res; })
  );

  it('finds the segments', () =>
    agent
      .createMap('hi')
      .then(() => agent.createMap('hi'))
      .then(() => agent.findSegments())
      .then(segments => {
        segments.should.be.an.Array();
        segments.length.should.be.exactly(2);
      })
  );

  it('applies the options', () =>
    agent
      .createMap('hi')
      .then(() => agent.createMap('hi'))
      .then(segment => agent.findSegments({ mapId: segment.link.meta.mapId }))
      .then(segments => {
        segments.should.be.an.Array();
        segments.length.should.be.exactly(1);
      })
  );

  it('returns segmentified segments', () =>
    agent
      .createMap('hi')
      .then(() => agent.createMap('hi'))
      .then(() => agent.findSegments())
      .then(segments => {
        segments.forEach(segment => segment.getPrev.should.be.a.Function());
      })
  );

});
