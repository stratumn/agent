/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

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

  it('works when init is null', () => {
    const a = { action: actions.action };

    getActionsInfo(a).should.deepEqual({
      init: { args: [] },
      action: { args: ['d'] }
    });
  });
});
