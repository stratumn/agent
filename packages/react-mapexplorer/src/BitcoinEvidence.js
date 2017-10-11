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

import React, { PropTypes } from 'react';
import radium from 'radium';
import MerklePathComponent from './MerklePathComponent';

function getStyles() {
  return {
    evidenceContent: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around'
    }
  };
}

const BitcoinEvidence = ({ evidence }) => {
  const styles = getStyles();
  let evidenceInfo;
  let evidenceTree;
  const evidenceComplete = evidence.state === 'COMPLETE';

  if (evidenceComplete) {
    const tx = evidence.transactions
      ? evidence.transactions['bitcoin:main']
      : '';
    evidenceInfo = (
      <div>
        <h4>Bitcoin Transaction</h4>
        <p>
          {tx}
          <a target="_blank" href={`https://blockchain.info/tx/${tx}`}>
            View transaction on Blockchain.info
          </a>
        </p>

        <h4>Merkle root</h4>
        <p>{evidence.merkleRoot}</p>
      </div>
    );

    evidenceTree = (
      <div className="merkle-path">
        <h4>Merkle Path</h4>
        <MerklePathComponent merklePath={evidence.merklePath} />
      </div>
    );
  }

  return (
    <div style={styles.evidenceContent}>
      <div className="info">
        <h4>State</h4>
        <p>{evidence.state}</p>
        {evidenceInfo}
      </div>
      {evidenceTree}
    </div>
  );
};

BitcoinEvidence.propTypes = {
  evidence: PropTypes.shape({
    state: PropTypes.string.isRequired
  }).isRequired
};

export default radium(BitcoinEvidence);
