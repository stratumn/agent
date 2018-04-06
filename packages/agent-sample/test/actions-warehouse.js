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

import Agent from '@indigocore/agent';
import warehouseTracker from '../lib/actions-warehouse';

describe('warehouse tracker', () => {
  let map;

  beforeEach(() => {
    map = Agent.processify(warehouseTracker);
  });

  describe('#init()', () => {
    it('sets the state correctly', () =>
      map.init('area51').then(link => {
        link.state.warehouse.should.be.exactly('area51');
      }));

    it('requires a warehouse', () =>
      map
        .init()
        .then(() => {
          throw new Error('link should not have been created');
        })
        .catch(err => {
          err.message.should.be.exactly('a warehouse is required');
        }));
  });

  describe('#storeItem()', () => {
    it('updates the state correctly', () =>
      map
        .init('area51')
        .then(() => map.storeItem('42', 'important item'))
        .then(link => {
          link.state.items['42'].description.should.be.exactly(
            'important item'
          );
        }));

    it('does not allow duplicate items', () =>
      map
        .init('area51')
        .then(() => map.storeItem('42', 'important item'))
        .then(() => map.storeItem('42', 'is it really important?'))
        .then(() => {
          throw new Error('link should not have been created');
        })
        .catch(err => {
          err.message.should.be.exactly(
            'this item is already inside the warehouse'
          );
        }));
  });

  describe('#enter()', () => {
    it('records employee', () =>
      map
        .init('area51')
        .then(() => map.enter('batman'))
        .then(link => {
          const batmanActivity = link.state.employees.batman;
          batmanActivity.length.should.be.exactly(1);
        }));
  });

  describe('#leave()', () => {
    it('records employee', () =>
      map
        .init('area51')
        .then(() => map.enter('batman'))
        .then(() => map.leave('batman'))
        .then(link => {
          const batmanActivity = link.state.employees.batman;
          batmanActivity.length.should.be.exactly(2);
          batmanActivity[1].activity.should.be.exactly('leave');
        }));
  });
});
