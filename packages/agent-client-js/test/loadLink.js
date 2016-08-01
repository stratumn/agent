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
