/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import getAgent from '../src/getAgent';
import agentHttpServer from './utils/agentHttpServer';

describe('#getLink', () => {

  let closeServer;
  beforeEach(() => agentHttpServer(3333).then(c => { closeServer = c; }));
  afterEach(() => closeServer());

  let agent;
  beforeEach(() =>
    getAgent('http://localhost:3333').then(res => { agent = res; })
  );

  // Deprecated
  it('gets a segment', () =>
    agent
      .createMap('hi there')
      .then(segment =>
        agent.getLink(segment.meta.linkHash)
      )
      .then(segment => {
        segment.link.state.title.should.be.exactly('hi there');
      })
  );

});
