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
  /**
    * Initialize a message board.
    * @param {string} title - name or identifier of the message board
    */
  init(title) {
    console.log('init called');
    if (!title) {
      return this.reject('a title is required');
    }

    this.state = {
      title: title
    };

    return this.append();
  },

  /**
    * Post a message on the message board.
    * @param {string} author - name of the author
    * @param {string} body - body of the message
    */
  message(author, body) {
    if (!author) {
      return this.reject('an author is required');
    }

    if (!body) {
      return this.reject('a body is required');
    }

    this.state = {
      body: body,
      author: author
    };

    return this.append();
  }
};
