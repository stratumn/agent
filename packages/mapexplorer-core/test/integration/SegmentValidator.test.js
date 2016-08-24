import { SegmentValidator } from 'mapexplorer-core';
import _2a4
  from '../fixtures/2a443211e871f58a6ee5a93e62ce36cac2ddfc0f05a6bec1e7b11aa8d5e4cf38.json';
import _d25
  from '../fixtures/d25a285b50204e1b0ca7472035d73cae93faea06ddac120800dd6aacca006688.json';

import validSegment from '../fixtures/validSegment.json';
import invalidSegment from '../fixtures/invalidSegment.json';
import brokenMerklePath from '../fixtures/brokenMerklePath.json';
import invalidMerklePathParent from '../fixtures/invalidMerklePathParent.json';
import invalidMerkleRoot from '../fixtures/invalidMerkleRoot.json';
import invalidFossil from '../fixtures/invalidFossil.json';


describe('SegmentValidator', () => {

  let server;

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

  beforeEach(() => {
    server = sinon.fakeServer.create();
    server.respondWith('GET',
      'https://api.blockcypher.com/v1/btc/main/txs/2a443211e871f58a6ee5a93e62ce36cac2ddfc0f05a6bec1e7b11aa8d5e4cf38',
      [200, { 'Content-type': 'application/json' }, _2a4.toString()]);

    server.respondWith('GET',
      'https://api.blockcypher.com/v1/btc/main/txs/d25a285b50204e1b0ca7472035d73cae93faea06ddac120800dd6aacca006688',
      [200, { 'Content-type': 'application/json' }, _d25.toString()]);
  });

  afterEach(() => server.restore());

  describe('With a valid segment', () => {
    it('validates', (done) => {
      Promise.all([].concat.apply([], Object.values(validate(validSegment)))).then(errors => {
        errors.filter(Boolean).should.be.empty();
        done();
      }).catch(done);
    });
  });

  describe('With a invalid segment', () => {
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
    it('validates the merklePath', (done) => {
      Promise.all(validate(brokenMerklePath).merklePath).then(res => {
        res[0].should.match(
          /Invalid Merkle Node {.*}: previous hash \(.*\)/);
      });
      done();
    });
  });

  describe('With an invalid merkle path parent', () => {
    it('validates the merklePath', (done) => {
      Promise.all(validate(invalidMerklePathParent).merklePath).then(res => {
        res[0].should.match(
          /Invalid Merkle Node {.*}: computed parent: .*/);
        done();
      });
    });
  });

  describe('With a invalid merkle root', () => {
    it('validates the merklePath', (done) => {
      Promise.all(validate(invalidMerkleRoot).merklePath).then(res => {
        res[0].should.match(
          /Invalid Merkle Root .*: not found in Merkle Path/);
        done();
      });
    });
  });

  describe('With a invalid fossil', () => {
    it('validates the fossil', (done) => {
      Promise.all(validate(invalidFossil).fossil).then(res => {
        res[0].should.eql('Merkle root not found in transaction data');
        done();
      });
    });
  });
});
