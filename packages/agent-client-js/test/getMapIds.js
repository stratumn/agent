import getAgent from '../src/getAgent';

describe('#getSegment', () => {

  let agent;

  beforeEach(() =>
    getAgent('http://localhost:3000').then(res => { agent = res; })
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
