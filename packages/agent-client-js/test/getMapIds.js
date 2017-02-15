/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import getAgent from '../src/getAgent';
import agentHttpServer from './utils/agentHttpServer';

describe('#getMapIds', () => {

  let closeServer;
  beforeEach(() => agentHttpServer(3333).then(c => { closeServer = c; }));
  afterEach(() => closeServer());

  let agent;

  beforeEach(() =>
    getAgent('http://localhost:3333').then(res => { agent = res; })
  );

  it('gets map IDs', () =>
    agent
      .createMap('hi')
      .then(() => agent.createMap('hi'))
      .then(() => agent.createMap('hi'))
      .then(() => agent.getMapIds())
      .then(mapIds => {
        mapIds.should.be.an.Array();
        mapIds.length.should.be.exactly(3);
        mapIds.forEach(mapId => mapId.should.be.a.String());
      })
  );

});
