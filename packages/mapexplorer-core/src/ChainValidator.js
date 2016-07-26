import SegmentValidator from './SegmentValidator';
import resolveLinks from './resolveLinks';

export default class ChainValidator {
  constructor(chainscript) {
    this.segments = chainscript;
    this.errors = {
      linkHash: [],
      stateHash: [],
      merklePath: [],
      fossil: []
    };
  }

  validate() {
    return resolveLinks(this.segments)
      .then(segments => {
        segments.forEach(segment => new SegmentValidator(segment).validate(this.errors));
        return this.errors;
      });
  }
}
