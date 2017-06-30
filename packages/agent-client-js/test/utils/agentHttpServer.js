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

import { memoryStore, create, httpServer } from 'stratumn-agent';

// Test actions
const actions = {

  init(title) {
    if (!title) {
      this.reject('a title is required');
      return;
    }

    this.state.title = title;
    this.state.messages = [];
    this.state.updatedAt = Date.now();
    this.meta.priority = 0;

    this.append();
  },

  addMessage(message, author) {
    if (!message) {
      this.reject('a message is required');
      return;
    }

    if (!author) {
      this.reject('an author is required');
      return;
    }

    this.state.messages.push({ message, author });
    this.state.updatedAt = Date.now();
    this.meta.priority++;

    this.append();
  },

  addTag(tag) {
    if (!tag) {
      this.reject('a tag is required');
      return;
    }

    this.meta.tags = this.meta.tags || [];
    this.meta.tags.push(tag);
    this.state.updatedAt = Date.now();
    this.meta.priority++;

    this.append();
  }
};

export default function agentHttpServer(port) {
  return new Promise(resolve => {
    const agent = create(actions, memoryStore(), null, { agentUrl: `http://localhost:${port}` });
    const server = httpServer(agent).listen(port, () => {
      const close = () => new Promise(done => server.close(done));
      resolve(close);
    });
  });
}
