import getAgent from '../src/getAgent';

describe('#createMap', () => {

  let agent;

  beforeEach(() =>
    getAgent('http://localhost:3000').then(res => { agent = res; })
  );

  it('creates a map', () =>
    agent
      .createMap('Test')
      .then(segment => {
        segment.link.state.title.should.be.exactly('Test');
      })
  );

});
