/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import hashJson from '../hashJson';

export default {

  name: 'State Hash',

  description: 'Computes and adds the hash of the state in meta',

  didCreateLink(link) {
    link.meta.stateHash = hashJson(link.state);
  },

  willCreate(initialLink) {
    delete initialLink.meta.stateHash;
  }
};
