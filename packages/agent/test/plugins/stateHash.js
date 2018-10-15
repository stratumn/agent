/*
  Copyright 2018 Stratumn SAS. All rights reserved.

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
import stateHash from '../../src/plugins/stateHash';
import hashJson from '../../src/hashJson';

pluginTest(stateHash, {
  '#createMap()'(segment) {
    segment.link.meta.data.stateHash.should.be.exactly(
      hashJson({ a: 1, b: 2, c: 3 })
    );
  },

  '#createSegment()'(segment) {
    segment.link.meta.data.stateHash.should.be.exactly(
      hashJson({ a: 1, b: 2, c: 3, d: 4 })
    );
  }
});
