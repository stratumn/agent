/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import create from '../../src/create';
import memoryStore from '../../src/memoryStore';

export default function (plugin, assertions1) {
  const assertions = Object.assign({
    '#init()': () => {},
    '#action()': () => {},
    '#createMap()': () => {},
    '#createSegment()': () => {},
  }, assertions1);

  const actions = {
    init(a, b, c) {
      assertions['#init()'](this);
      this.append({ a, b, c });
    },
    action(d) {
      assertions['#action()'](this);
      this.state.d = d; this.append();
    }
  };

  describe(`Agent With Plugin ${plugin.name}`, () => {
    let agent;

    beforeEach(() => {
      agent = create(actions, memoryStore(), null, { plugins: [plugin] });
    });
    afterEach(() => {
      delete actions.events;
    });

    describe('#createMap()', () => {
      it('creates a Map', () =>
        agent
          .createMap(1, 2, 3)
          .then(assertions['#createMap()'])
      );
    });

    describe('#createSegment()', () => {
      it('creates a segment', () =>
        agent
          .createMap(1, 2, 3)
          .then(segment1 => (
            agent
              .createSegment(segment1.meta.linkHash, 'action', 4)
              .then(assertions['#createSegment()'])
          )
        )
      );
    });
  });
}
