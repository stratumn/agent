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

import Agent from '@indigocore/agent';
import messageBoard from '../lib/actions-message';

describe('message board', () => {
  let map;

  beforeEach(() => {
    map = Agent.processify(messageBoard);
  });

  describe('#init()', () => {
    it('sets the state correctly', () =>
      map.init('Hello, World!').then(link => {
        link.state.title.should.be.exactly('Hello, World!');
      }));

    it('requires a title', () =>
      map
        .init()
        .then(() => {
          throw new Error('link should not have been created');
        })
        .catch(err => {
          err.message.should.be.exactly('a title is required');
        }));
  });

  describe('#message()', () => {
    it('updates the state correctly', () =>
      map
        .init('Hello, World!')
        .then(() => map.message('Me', 'Hi'))
        .then(link => {
          link.state.should.deepEqual({ body: 'Hi', author: 'Me' });
        }));

    it('requires an author', () =>
      map
        .init('Hello, World!')
        .then(() => map.message())
        .then(() => {
          throw new Error('link should not have been created');
        })
        .catch(err => {
          err.message.should.be.exactly('an author is required');
        }));

    it('requires a body', () =>
      map
        .init('Hello, World!')
        .then(() => map.message('Me'))
        .then(() => {
          throw new Error('link should not have been created');
        })
        .catch(err => {
          err.message.should.be.exactly('a body is required');
        }));
  });
});
