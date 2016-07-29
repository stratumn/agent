import SegmentValidator from './SegmentValidator';
import resolveLinks from './resolveLinks';
import wrap from './wrap';

export default class ChainValidator {
  constructor(chainscript) {
    this.segments = wrap(chainscript);
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
