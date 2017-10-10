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

const jsonStyle = {
  whiteSpace: 'pre-wrap'
};

const TMPopEvidence = ({ evidence }) => (
  <div>
    <h2>TMPop evidence</h2>

    <h4>State</h4>
    <p>{evidence.state}</p>
    <h4>Chain ID</h4>
    <p>{evidence.provider}</p>

    <h4>Block #</h4>
    <p>{evidence.proof.original.blockHeight}</p>

    <h4>App Hash</h4>
    <p>{evidence.proof.original.header.app_hash}</p>

    <h4>Leaf Hash</h4>
    <p>{evidence.proof.original.merkleProof.LeafHash}</p>

    <h4>MerklePath</h4>
    <pre style={jsonStyle}>
      {JSON.stringify(evidence.proof.original.merkleProof.InnerNodes)}
    </pre>
  </div>
);

TMPopEvidence.propTypes = {
  evidence: PropTypes.shape({
    state: PropTypes.string,
    provider: PropTypes.string,
    backend: PropTypes.string,
    proof: PropTypes.shape({
      original: PropTypes.object,
      current: PropTypes.object
    })
  }).isRequired
};

export default TMPopEvidence;
