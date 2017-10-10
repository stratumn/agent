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
  name: 'Action arguments',

  description: 'Saves the action and its arguments in link meta information.',

  didCreateLink(link, action, args) {
    link.meta.action = action;
    link.meta.arguments = args;
  },

  willCreate(initialLink) {
    delete initialLink.meta.action;
    delete initialLink.meta.arguments;
  }
};
