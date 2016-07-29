import SegmentValidator from './SegmentValidator';
import resolveLinks from './resolveLinks';
import wrap from './wrap';
import parseIfJson from './parseIfJson';

export default class ChainValidator {
  constructor(chainscript) {
    this.chainscript = chainscript;
    this.errors = {
      linkHash: [],
      stateHash: [],
      merklePath: [],
      fossil: []
    };
  }

  validate() {
    try {
      return resolveLinks(wrap(parseIfJson(this.chainscript)))
        .then(segments => {
          wrap(segments).forEach(segment => new SegmentValidator(segment).validate(this.errors));
          return this.errors;
        });
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
