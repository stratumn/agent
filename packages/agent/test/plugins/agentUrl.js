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

import agentUrl from '../../src/plugins/agentUrl';

describe('agentUrl', () => {
  describe('#filterSegments()', () => {
    it("should add the agent url to the segments' meta", () => {
      const segment = {
        link: {
          state: 'The link',
          meta: { process: 'yolo' }
        },
        meta: { linkHash: 42 }
      };
      return agentUrl('The agent url')
        .filterSegment(segment)
        .then(ok => {
          ok.should.be.ok();
          segment.meta.agentUrl.should.be.equal('The agent url');
        });
    });
  });
});
