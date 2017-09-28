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

import findSegments from './findSegments';
import deprecated from './deprecated';

export default function getBranches(adaptor, agent, prevLinkHash, tags = null) {
  deprecated(
    'Agent#getBranches(agent, prevLinkHash, tags = [])',
    'Agent#findSegments(agent, filter)'
  );

  const opts = tags ? { prevLinkHash, tags } : { prevLinkHash };

  return findSegments(adaptor, agent, opts);
}
