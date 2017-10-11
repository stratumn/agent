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

import httpplease from 'httpplease';
import hashJson from './hashJson';

import computeMerkleParent from './computeMerkleParent';

const blockCypherCache = {};

function getFossil(txId) {
  if (blockCypherCache[txId]) {
    return Promise.resolve(blockCypherCache[txId]);
  }

  const p = new Promise((resolve, reject) =>
    httpplease.get(
      `https://api.blockcypher.com/v1/btc/main/txs/${txId}`,
      (err, res) => (err ? reject(err) : resolve(res))
    )
  );
  blockCypherCache[txId] = p;
  return p;
}

export default class SegmentValidator {
  constructor(segment) {
    this.segment = segment;
  }

  validate(errors) {
    errors.linkHash.push(this.validateLinkHash());
    errors.stateHash.push(this.validateStateHash());
    errors.merklePath.push(this.validateMerklePath());
    errors.fossil.push(this.validateFossil());
  }

  validateLinkHash() {
    const computed = hashJson(this.segment.link);
    const actual = this.segment.meta.linkHash;
    if (computed !== actual) {
      return `LinkHash computed: ${computed}, Found: ${actual}`;
    }
    return null;
  }

  validateStateHash() {
    if (this.segment.link.state) {
      const computed = hashJson(this.segment.link.state);
      const actual = this.segment.link.meta.stateHash;
      if (computed !== actual) {
        return `StateHash computed: ${computed}, Found: ${actual}`;
      }
    }
    return null;
  }

  validateMerklePath() {
    const { evidence } = this.segment.meta;
    if (evidence) {
      if (evidence.state === 'COMPLETE') {
        let previous = this.segment.meta.linkHash;

        let error;
        evidence.merklePath.every(merkleNode => {
          if (merkleNode.left === previous || merkleNode.right === previous) {
            const computedParent = computeMerkleParent(
              merkleNode.left,
              merkleNode.right
            );

            if (computedParent !== merkleNode.parent) {
              error =
                `Invalid Merkle Node ${JSON.stringify(merkleNode)}: ` +
                `computed parent: ${computedParent}`;
              return false;
            }
            previous = merkleNode.parent;
            return true;
          }
          error =
            `Invalid Merkle Node ${JSON.stringify(merkleNode)}: ` +
            `previous hash (${previous}) not found`;
          return false;
        });

        if (error) {
          return error;
        }

        const lastMerkleNode =
          evidence.merklePath[evidence.merklePath.length - 1];
        if (lastMerkleNode.parent !== evidence.merkleRoot) {
          return `Invalid Merkle Root ${evidence.merkleRoot}: not found in Merkle Path`;
        }
      }
    }
    return null;
  }

  validateFossil() {
    const txId = this.segment.meta.evidence.transactions['bitcoin:main'];
    return getFossil(txId).then(res => {
      const body = JSON.parse(res.xhr.response);
      if (
        !body.outputs.find(
          output => output.data_hex === this.segment.meta.evidence.merkleRoot
        )
      ) {
        return 'Merkle root not found in transaction data';
      }
      return null;
    });
  }
}
