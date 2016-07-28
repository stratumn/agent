import getAgentInfo from '../src/getAgentInfo';

const actions = {
  init(a, b, c) { this.append({ a, b, c }); },
  action(d) { this.state.d = d; this.append(); }
};

// TODO: tests
describe('#getAgentInfo()', () => {
  it('returns the agent info', () => {
    getAgentInfo(actions).should.deepEqual({
      functions: {
        init: { args: ['a', 'b', 'c'] },
        action: { args: ['d'] }
      }
    });
  });
});
