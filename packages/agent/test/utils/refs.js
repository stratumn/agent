/*
  Copyright 2016-2018 Stratumn SAS. All rights reserved.

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
  getValidRefs(process, linkHash) {
    const l =
      linkHash ||
      'fa871e81c469fa947eacd40f89dc5627a0cb3a96551a651c034787c752d4448f';
    const goodLink = {
      process,
      linkHash: l,
      meta: 'father'
    };
    const otherProcess = {
      process: 'foo',
      linkHash: l,
      meta: 'uncle'
    };
    return [goodLink, otherProcess];
  },

  getInvalidRefs() {
    return [{ process: 'foo', meta: 'father' }];
  }
};
