import fs from 'fs';
import { join } from 'path';
import loadLink from '../src/loadLink';

describe('#loadLink', () => {

  const segment = JSON.parse(fs.readFileSync(join(__dirname, `./fixtures/segment.json`)));

  it('loads a link', () =>
    loadLink(segment)
      .then(res => {
        res.link.state.should.not.be.empty();
      })
  );

});
