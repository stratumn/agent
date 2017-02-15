/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

// Deprecated.
import getApplication from '../src/getApplication';
import config from '../src/config';
import agentHttpServer from './utils/agentHttpServer';

config.applicationUrl = 'http://localhost:3333';

describe('#getApplication', () => {

  let closeServer;
  beforeEach(() => agentHttpServer(3333).then(c => { closeServer = c; }));
  afterEach(() => closeServer());

  it('loads an application', () =>
    getApplication('test')
      .then(agent => {
        agent.storeInfo.adapter.name.should.be.exactly('memory');
      })
  );

});
