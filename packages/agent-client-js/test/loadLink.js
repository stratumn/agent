/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

// Deprecated.
import fs from 'fs';
import { join } from 'path';
import loadLink from '../src/loadLink';
import agentHttpServer from './utils/agentHttpServer';

describe('#loadLink', () => {

  let closeServer;
  beforeEach(() => agentHttpServer(3333).then(c => { closeServer = c; }));
  afterEach(() => closeServer());

  const segment = JSON.parse(fs.readFileSync(join(__dirname, './fixtures/segment.json')));

  it('loads a link', () =>
    loadLink(segment)
      .then(res => {
        res.link.state.should.not.be.empty();
      })
  );

});
