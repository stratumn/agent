import should from 'should';
import { deepGet, base64ToHex, base64ToUnicode } from '../src/utils';

describe('utils', () => {
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
  describe('#deepGet', () => {
    const obj = {
      k1: { k11: [42, 'yolo'] },
      k2: { k21: false, k22: null }
    };

    it('should return a correct value for a valid path', () => {
      deepGet(obj, 'k1.k11').should.be.equal(obj.k1.k11);
      // should also work with list indexes
      deepGet(obj, 'k1.k11.0').should.be.equal(42);
    });

    it('should return value even if falsy', () => {
      deepGet(obj, 'k2.k21', 123).should.be.equal(false);
      should(deepGet(obj, 'k2.k22', 123)).be.equal(null);
    });

    it('should return default value if path invalid', () => {
      deepGet(obj, 'k1.k13', 123).should.be.equal(123);
      deepGet(obj, 'k1.k11.2', 123).should.be.equal(123);
    });
  });
});
