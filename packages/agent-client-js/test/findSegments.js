import getAgent from '../src/getAgent';

describe('#findSegments', () => {

  let agent;

  beforeEach(() =>
    getAgent('http://localhost:3000').then(res => { agent = res; })
  );

  it('finds the segments', () =>
    agent
      .findSegments()
      .then(segments => {
        segments.should.be.an.Array();
      })
  );

  it('applies the options', () => {
    let segment;

    agent
      .createMap('hi')
      .then(res => {
        segment = res;
        return agent.findSegments({ mapId: segment.link.meta.mapId });
      })
      .then(segments => {
        segments.should.be.an.Array();
        segments.length.should.be.exactly(1);
      });
  });

  it('returns segmentified segments', () =>
    agent
      .findSegments()
      .then(segments => {
        segments.forEach(segment => segment.getPrev.should.be.a.Function());
      })
  );

});
