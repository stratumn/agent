/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import pluginTest from '.';
import agentUrl from '../../src/plugins/agentUrl';

const url = 'http://localhost';

function test(segment) {
  segment.meta.agentUrl.should.be.exactly('http://localhost');
  segment.meta.segmentUrl.should.be.exactly(`http://localhost/segments/${segment.meta.linkHash}`);
}

pluginTest(agentUrl(url), {
  '#createMap()'(segment) {
    test(segment);
  },

  '#createSegment()'(segment) {
    test(segment);
  }
});

