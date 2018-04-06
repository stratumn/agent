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

export default {
  init(a, b, c) {
    this.state = { a, b, c };
    this.append();
  },
  action(d) {
    this.state.d = d;
    this.append();
  },
  testLoadSegments() {
    if (this.meta.refs != null) {
      const segmentPromises = this.meta.refs.map(ref =>
        this.loadSegment(ref)
          .then(seg => (seg ? 1 : 0))
          .catch(() => -1)
      );
      Promise.all(segmentPromises).then(segs => {
        this.state.nbSeg = segs.reduce((a, b) => a + (b > 0 ? 1 : 0), 0);
        this.state.nbErr = segs.reduce((a, b) => a + (b < 0 ? 1 : 0), 0);
        this.state.nbNull = segs.reduce((a, b) => a + (b === 0 ? 1 : 0), 0);
        this.append();
      });
    }
  }
};
