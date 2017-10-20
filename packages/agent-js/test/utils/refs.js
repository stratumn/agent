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

export default {
  getGoodRefs(process, linkHash) {
    const l =
      linkHash ||
      'fa871e81c469fa947eacd40f89dc5627a0cb3a96551a651c034787c752d4448f';
    const goodLink = {
      process,
      linkHash: l,
      meta: 'father'
    };
    const goodSegment = {
      segment: {
        link: {
          meta: {
            mapId: '1cc3a5ee-54e4-4093-92f7-efa591f85382',
            prevLinkHash:
              '2f0d1bde3f163446d6f23e31bd0b43063ec07ea4128cf5a258208e9f80832735',
            process: 'foobar',
            stateHash:
              '124c9b6c55def7bc177c81d98ba12898b018a534c3101961a4b683678fa2d679'
          }
        },
        meta: {
          linkHash:
            'e312a9d43d1401eeb62af52810ee8b6b746b67835eb040755ccb1598a5c88411',
          segmentUrl:
            'http://localhost:3000/segments/e312a9d43d1401eeb62af52810ee8b6b746b67835eb040755ccb1598a5c88411'
        }
      },
      meta: 'mother'
    };
    const otherProcess = {
      process: 'foo',
      linkHash: l,
      meta: 'uncle'
    };
    return [goodLink, goodSegment, otherProcess];
  },

  getBadRefs() {
    return [{ process: 'foo', meta: 'father' }];
  }
};
