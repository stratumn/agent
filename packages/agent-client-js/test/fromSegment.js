import fs from 'fs';
import { join } from 'path';
import fromSegment from '../src/fromSegment';

describe('#fromSegment', () => {

  const raw = JSON.parse(fs.readFileSync(join(__dirname, './fixtures/segment.json')));

  it('loads a segment', () =>
    fromSegment(raw)
      .then(({ agent, segment }) => {
        agent.findSegments.should.be.a.Function();
        segment.link.should.deepEqual(raw.link);
      })
  );

});
