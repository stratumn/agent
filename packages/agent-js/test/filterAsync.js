/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import filterAsync from '../src/filterAsync';

describe('#filterAsync()', () => {
  it('returns a promise that resolves with the filtered array', done => {
    const a = ['a', 'b', 'c', 'd'];

    filterAsync(a, elt => Promise.resolve(elt === 'a'))
      .then(result => {
        result.should.eql(['a']);
        done();
      })
      .catch(done);
  });
});
