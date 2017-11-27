import { expect } from 'chai';
import shortHash from './shortHash';

describe('shortHash()', () => {
  it('shorten the hash when too long', () => {
    const h =
      '387b5d41024cb8b99d6d4baec3d2651e0999e73e51ee88df01496d08917a3b65';
    const expected = '387b5d41..65';
    expect(shortHash(h)).to.equal(expected);
  });

  it('shorten the hash when exactly 13 chars long', () => {
    const h = '387b5d41024cb';
    const expected = '387b5d41..cb';
    expect(shortHash(h)).to.equal(expected);
  });

  it('does not shorten the hash when 12 chars or less', () => {
    const h12 = '387b5d41024c';
    expect(shortHash(h12)).to.equal(h12);
    const h5 = '387b5';
    expect(shortHash(h5)).to.equal(h5);
  });
});
