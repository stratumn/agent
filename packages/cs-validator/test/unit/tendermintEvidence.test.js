/*
  Copyright 2016-2018 Stratumn SAS. All rights reserved.

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

import validateTendermintEvidence from '../../src/tendermintEvidence';

import validSegment from '../fixtures/validSegment.json';

describe('tendermint evidence', () => {
  it('validates proof', () => {
    const error = validateTendermintEvidence(
      validSegment.meta.evidences[0],
      validSegment.meta.linkHash
    );
    if (error) {
      throw error;
    }
  });

  it('rejects link hash mismatch', () => {
    const error = validateTendermintEvidence(
      validSegment.meta.evidences[0],
      '222322d97fc42ecf980ba82a09b48778fbd38e5f94d5ffa6a593ed1b4dbb6f16'
    );
    error.should.eql('invalid merkle path');
  });

  // Activate these tests once Tendermint provides a way to verify validators hash from JS.
  // See https://github.com/tendermint/js-wire/issues/1

  // it('rejects missing signature', () => {
  //   const missingSig = Object.assign({}, validSegment.meta.evidences[0]);
  //   missingSig.proof.next_header_votes = null;

  //   const error = validateTendermintEvidence(
  //     missingSig,
  //     validSegment.meta.linkHash
  //   );
  //   error.should.eql('missing signature');
  // });

  // it('rejects invalid signature', () => {
  //   const invalidSig = Object.assign({}, validSegment.meta.evidences[0]);
  //   // Changing the vote object will make its signature invalid.
  //   invalidSig.proof.header_votes[0].vote.round = 42;

  //   const error = validateTendermintEvidence(
  //     invalidSig,
  //     validSegment.meta.linkHash
  //   );
  //   error.should.eql('invalid signature');
  // });

  // it('rejects block hash mismatch', () => {
  //   const hashMismatch = Object.assign({}, validSegment.meta.evidences[0]);
  //   // Changing the header will make the vote invalid.
  //   hashMismatch.proof.header.total_txs = 42;

  //   const error = validateTendermintEvidence(
  //     hashMismatch,
  //     validSegment.meta.linkHash
  //   );
  //   error.should.eql('invalid header');
  // });

  // it('rejects missing next header', () => {
  //   const missingHeader = Object.assign({}, validSegment.meta.evidences[0]);
  //   missingHeader.proof.next_header = null;

  //   const error = validateTendermintEvidence(
  //     missingHeader,
  //     validSegment.meta.linkHash
  //   );
  //   error.should.eql('missing header');
  // });
});
