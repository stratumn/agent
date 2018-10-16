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

import getActionsInfo from '../src/getActionsInfo';
import actions from './utils/basicActions';

describe('#getActionsInfo()', () => {
  it('returns the actions info', () => {
    getActionsInfo(actions).should.deepEqual({
      init: { args: ['a', 'b', 'c'] },
      action: { args: ['d'] },
      testLoadSegments: { args: [] }
    });
  });

  it('works when init is null', () => {
    const a = { action: actions.action };

    getActionsInfo(a).should.deepEqual({
      init: { args: [] },
      action: { args: ['d'] }
    });
  });
});
