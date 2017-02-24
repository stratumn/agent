/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import hashJson from '../src/hashJson';

describe('#hashJson()', () => {
  it('returns a sha2-256 hash', () => {
    hashJson({ test: true }).should.be.exactly(
      '6fd977db9b2afe87a9ceee48432881299a6aaf83d935fbbe83007660287f9c2e'
    );
  });

  it('returns a canonical hash', () => {
    hashJson({ a: 1000, b: null }).should.be.exactly(hashJson({ b: null, a: 1e3 }));
  });
});
