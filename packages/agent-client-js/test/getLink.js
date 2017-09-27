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

import { runTestsWithDataAndAgent } from './utils/testSetUp';

describe('#getLink', () => {

  runTestsWithDataAndAgent(processCb => {
    // Deprecated
    it('gets a segment', () =>
      processCb()
        .createMap('hi there')
        .then(segment =>
          processCb().getLink(segment.meta.linkHash)
        )
        .then(segment => {
          segment.link.state.title.should.be.exactly('hi there');
        })
    );
  });

});
