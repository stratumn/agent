/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

export default {

  name: 'Action arguments',

  description: 'Saves the action and its arguments in link meta information',

  didCreateLink(link, action, args) {
    link.meta.action = action;
    link.meta.arguments = args;
  },

  willCreate(initialLink) {
    delete initialLink.meta.action;
    delete initialLink.meta.arguments;
  }
};
