import getActionsInfo from '../src/getActionsInfo';

const actions = {
  init(a, b, c) { this.append({ a, b, c }); },
  action(d) { this.state.d = d; this.append(); }
};

describe('#getActionsInfo()', () => {
  it('returns the actions info', () => {
    getActionsInfo(actions).should.deepEqual({
      init: { args: ['a', 'b', 'c'] },
      action: { args: ['d'] }
    });
  });
});
