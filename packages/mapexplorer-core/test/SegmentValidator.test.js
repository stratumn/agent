import SegmentValidator from '../src/SegmentValidator';
import loadFixture from './utils/loadFixture';

describe('SegmentValidator', () => {

  function validate(segment) {
    const errors = {
      linkHash: [],
      stateHash: [],
      merklePath: [],
      fossil: []
    };
    new SegmentValidator(segment).validate(errors);
    return errors;
  }

  describe('With a valid segment', () => {
    const validSegment = loadFixture('validSegment');

    it('validates', (done) => {
      Promise.all([].concat.apply([], Object.values(validate(validSegment)))).then(errors => {
        errors.filter(Boolean).should.be.empty();
        done();
      }).catch(done);
    });
  });

  describe('With a invalid segment', () => {
    const invalidSegment = loadFixture('invalidSegment');

    it('validates the linkHash', (done) => {
      Promise.all(validate(invalidSegment).linkHash).then(res => {
        res[0].should.eql(
          'LinkHash computed: d8246aa32c66b33764b3722f355cf1b137ab20dde0b770b10c96b5135d3d1508, ' +
          'Found: 5b597c841a72f4608e130217a16c1a3a33d4a55957f49b4f0d02b563a92ffc4g');
        done();
      });
    });

    it('validates the stateHash', (done) => {
      Promise.all(validate(invalidSegment).stateHash).then(res => {
        res[0].should.eql(
        'StateHash computed: c30d47feab3b31632bbeb665833d7d4d72b9ad76e1e5e46e13b4a662111ef604, ' +
        'Found: c30d47feab3b31632bbeb665833d7d4d72b9ad76e1e5e46e13b4a662111ef605');
        done();
      });
    });
  });

  describe('With a broken merkle path', () => {
    const invalidSegment = loadFixture('brokenMerklePath');

    it('validates the merklePath', (done) => {
      Promise.all(validate(invalidSegment).merklePath).then(res => {
        res[0].should.match(
          /Invalid Merkle Node {.*}: previous hash \(.*\)/);
      });
      done();
    });
  });

  describe('With an invalid merkle path parent', () => {
    const invalidSegment = loadFixture('invalidMerklePathParent');

    it('validates the merklePath', (done) => {
      Promise.all(validate(invalidSegment).merklePath).then(res => {
        res[0].should.match(
          /Invalid Merkle Node {.*}: computed parent: .*/);
        done();
      });
    });
  });

  describe('With a invalid merkle root', () => {
    const invalidSegment = loadFixture('invalidMerkleRoot');

    it('validates the merklePath', (done) => {
      Promise.all(validate(invalidSegment).merklePath).then(res => {
        res[0].should.match(
          /Invalid Merkle Root .*: not found in Merkle Path/);
        done();
      });
    });
  });

  describe('With a invalid fossil', () => {
    const invalidFossil = loadFixture('invalidFossil');

    it('validates the fossil', (done) => {
      Promise.all(validate(invalidFossil).fossil).then(res => {
        res[0].should.eql('Merkle root not found in transaction data');
        done();
      });
    });
  });
});
