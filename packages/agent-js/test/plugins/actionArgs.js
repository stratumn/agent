/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import pluginTest from '.';
import actionArgs from '../../src/plugins/actionArgs';

pluginTest(actionArgs, {
  '#createMap()'(segment) {
    segment.link.meta.action.should.be.exactly('init');
    segment.link.meta.arguments.should.deepEqual([1, 2, 3]);
  },

  '#createSegment()'(segment) {
    segment.link.meta.action.should.be.exactly('action');
    segment.link.meta.arguments.should.deepEqual([4]);
  },

  '#action()'(link) {
    return (link.meta.action === null).should.be.true &&
      (link.meta.arguments === null).should.be.true;
  }
});

