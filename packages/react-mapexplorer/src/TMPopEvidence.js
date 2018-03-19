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

import React from 'react';
import PropTypes from 'prop-types';
import MerklePathComponent from './MerklePathComponent';
import TMPopHeader from './TMPopHeader';

const TMPopEvidence = ({ evidence }) => {
  let merkleTree;
  if (evidence.proof.merkle_path.length > 0) {
    merkleTree = (
      <div className="merkle-path">
        <h4>MerklePath</h4>
        <MerklePathComponent merklePath={evidence.proof.merkle_path} />
      </div>
    );
  }

  return (
    <div>
      <h2>TMPop evidence</h2>
      <div className="evidence">
        <div className="info">
          <h4>Chain ID</h4>
          <p>{evidence.provider}</p>

          <hr />

          <TMPopHeader
            header={evidence.proof.header}
            votes={evidence.proof.header_votes}
            validators={evidence.proof.header_validator_set.validators}
          />

          <hr />

          <TMPopHeader
            header={evidence.proof.next_header}
            votes={evidence.proof.next_header_votes}
            validators={evidence.proof.next_header_validator_set.validators}
          />

          <hr />

          <h4>Validations Hash</h4>
          <p>{evidence.proof.validations_hash}</p>

          <h4>Merkle Root</h4>
          <p>{evidence.proof.merkle_root}</p>
        </div>
        {merkleTree}
      </div>
    </div>
  );
};

TMPopEvidence.propTypes = {
  evidence: PropTypes.shape({
    provider: PropTypes.string,
    backend: PropTypes.string,
    proof: PropTypes.shape({
      merkle_root: PropTypes.string,
      validations_hash: PropTypes.string
    })
  }).isRequired
};

export default TMPopEvidence;
