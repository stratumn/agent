/*
  Copyright 2017 Stratumn SAS. All rights reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import { SegmentValidator } from 'mapexplorer-core';

import validSegment from '../fixtures/validSegment.json';
import invalidSegment from '../fixtures/invalidSegment.json';
import brokenMerklePath from '../fixtures/brokenMerklePath.json';
import invalidMerklePathParent from '../fixtures/invalidMerklePathParent.json';
import invalidMerkleRoot from '../fixtures/invalidMerkleRoot.json';
import invalidFossil from '../fixtures/invalidFossil.json';

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
      Promise.all(validate(invalidFossil).fossil)
      .then(res => {
        res[0].should.eql('Merkle root not found in transaction data');
        done();
      })
      .catch(done);
    });
  });
});
