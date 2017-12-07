import { base64ToHex, base64ToUnicode } from '../src/utils';

describe('utlis', () => {
  describe('#base64ToHex', () => {
    it('should convert base64 to hex', () => {
      const str = 'Z6x7OW+8Kl0tjQ==';
      const expected = '67ac7b396fbc2a5d2d8d';
      const converted = base64ToHex(str);
      converted.should.be.equal(expected);
    });
  });
  describe('#base64ToUnicode', () => {
    it('should convert base64 to unicode', () => {
      const str = 'VHJ1c3QgdGhlIHByb2Nlc3M=';
      const expected = 'Trust the process';
      const converted = base64ToUnicode(str);
      converted.should.be.equal(expected);
    });
  });
});
