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

  it('handle error', () =>
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
