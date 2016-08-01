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
