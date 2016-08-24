import { ChainValidator } from 'mapexplorer-core';

import validMap from '../fixtures/fullMap.json';
import validSegment from '../fixtures/validSegment.json';

describe('ChainValidator', () => {
  function validate(map) {
    return new ChainValidator(map).validate();
  }

  describe('With a valid map', (done) => {
    it('validates the linkHash', () => {
      Object.values(validate(validMap)).forEach(type => {
        Promise.all(type).then(done).catch(done);
      });
    });
  });

  describe('With only a segment', (done) => {
    it('validates the linkHash', () => {
      Object.values(validate(validSegment)).forEach(type => {
        Promise.all(type).then(done).catch(done);
      });
    });
  });
});
