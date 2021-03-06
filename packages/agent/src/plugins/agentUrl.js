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

export default function(agentUrl) {
  return {
    name: 'Agent URL',

    description:
      'Saves in segment meta the URL that can be used to retrieve a segment.',

    filterSegment(segment) {
      const { meta } = segment;
      const { linkHash } = meta;
      const { process } = segment.link.meta;

      meta.agentUrl = agentUrl;
      meta.segmentUrl = `${agentUrl}/${process}/segments/${linkHash}`;
      return Promise.resolve(true);
    }
  };
}
