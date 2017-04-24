/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import getDefinedFilters from '../src/getDefinedFilters';

describe('#getDefinedFilters()', () => {
  it('returns the defined filterSegment functions', () => {
    const p1 = {
      filterSegment() {
        return;
      }
    };
    const p2 = {};
    const plugins = [p1, p2];

    const filtered = getDefinedFilters(plugins);
    filtered.should.containEql(p1.filterSegment.bind(p1));
    filtered.should.have.length(1);
  });
});
