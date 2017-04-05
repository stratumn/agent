/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import intersectArrays from '../src/intersectArrays';

describe('#intersectArrays()', () => {
  it('returns the intersection of different arrays', () => {
    const a1 = ['apple', 'orange', 'strawberry'];
    const a2 = ['abricot', 'apple', 'strawberry', 'banana'];
    const a3 = ['cherry', 'strawberry', 'apple', 'date', 'fig'];

    const a4 = intersectArrays([a1, a2, a3]);

    a4.sort().should.eql(['apple', 'strawberry']);
  });

  it('returns an empty array with no arrays', () => {
    const a = intersectArrays([]);
    a.should.eql([]);
  });
});
