/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import pluginTest from '.';
import stateHash from '../../src/plugins/stateHash';
import hashJson from '../../src/hashJson';

pluginTest(stateHash, {
  '#createMap()'(segment) {
    segment.link.meta.stateHash.should.be.exactly(hashJson({ a: 1, b: 2, c: 3 }));
  },

  '#createSegment()'(segment) {
    segment.link.meta.stateHash.should.be.exactly(hashJson({ a: 1, b: 2, c: 3, d: 4 }));
  }
});

