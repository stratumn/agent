import getAgent from '../src/getAgent';

describe('#getMapIds', () => {

  let agent;

  beforeEach(() =>
    getAgent('http://localhost:3000').then(res => { agent = res; })
  );

  it('gets map IDs', () =>
    agent.getMapIds()
      .then(mapIds => {
        mapIds.should.be.an.Array();
        mapIds.forEach(mapId => mapId.should.be.a.String());
      })
  );

});
