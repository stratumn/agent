/*
    Stratumn Agent Javascript Library
    Copyright (C) 2017  Stratumn SAS

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
