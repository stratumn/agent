/*
  Copyright 2017 Stratumn SAS. All rights reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
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

