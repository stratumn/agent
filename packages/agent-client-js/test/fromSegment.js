/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import fs from 'fs';
import { join } from 'path';
import fromSegment from '../src/fromSegment';
import agentHttpServer from './utils/agentHttpServer';

describe('#fromSegment', () => {

  let closeServer;
  beforeEach(() => agentHttpServer(3333).then(c => { closeServer = c; }));
  afterEach(() => closeServer());

  const raw = JSON.parse(fs.readFileSync(join(__dirname, './fixtures/segment.json')));

  it('loads a segment', () =>
    fromSegment(raw)
      .then(({ agent, segment }) => {
        agent.findSegments.should.be.a.Function();
        segment.link.should.deepEqual(raw.link);
      })
  );

});
