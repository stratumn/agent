/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import pluginTest from '.';
import localTime from '../../src/plugins/localTime';

function test(segment) {
  segment.link.meta.localTime.should.be.a.Number();
}

pluginTest(localTime, {
  '#createMap()'(segment) {
    test(segment);
  },

  '#createSegment()'(segment) {
    test(segment);
  },

  '#action()'(link) {
    return (link.meta.localTime === null).should.be.true;
  }
});

