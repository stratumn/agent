import getAgent from '../src/getAgent';

describe('#getAgent', () => {

  it('loads an agent', () =>
    getAgent('localhost:3000')
      .then(agent => {
        agent.storeInfo.adapter.name.should.be.exactly('file');
      })
  );

});
