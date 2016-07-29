import ChainValidator from '../src/ChainValidator';
import loadFixture from './utils/loadFixture';

describe('ChainValidator', () => {

  function validate(map) {
    return new ChainValidator(map).validate();
  }

  describe('With a valid map', (done) => {
    const validMap = loadFixture('validMap');

    it('validates the linkHash', () => {
      Object.values(validate(validMap)).forEach(type => {
        Promise.all(type).then(done).catch(done);
      });
    });
  });

  describe('With only a segment', (done) => {
    const validSegment = loadFixture('validSegment');

    it('validates the linkHash', () => {
      Object.values(validate(validSegment)).forEach(type => {
        Promise.all(type).then(done).catch(done);
      });
    });
  });

});
