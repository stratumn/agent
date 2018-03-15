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

import { sign as nacl } from 'tweetnacl';
import { stringify } from 'canonicaljson';
import { search } from 'jmespath';

import httpplease from 'httpplease';
import hashJson from './hashJson';

import computeMerkleParent from './computeMerkleParent';

const blockCypherCache = {};

const handledKeyFormats = ['ed25519'];

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

function validateFossil(evidence) {
  return getFossil(evidence.proof.txid).then(res => {
    const body = JSON.parse(res.xhr.response);
    if (
      !body.outputs.find(
        output => output.data_hex === evidence.proof.batch.merkleRoot
      )
    ) {
      return 'Merkle root not found in transaction data';
    }
    return null;
  });
}

function validateMerklePath(evidence, linkHash) {
  let previous = linkHash;

  let error;
  evidence.proof.batch.merklePath.every(merkleNode => {
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

  if (evidence.proof.batch.merklePath.length > 0) {
    const lastMerkleNode =
      evidence.proof.batch.merklePath[
        evidence.proof.batch.merklePath.length - 1
      ];
    if (lastMerkleNode.parent !== evidence.proof.batch.merkleRoot) {
      return `Invalid Merkle Root ${evidence.proof.batch
        .merkleRoot}: not found in Merkle Path`;
    }
  }
  return null;
}

function validateSignature(sig, link) {
  if (!sig.type || !sig.publicKey || !sig.signature || !sig.payload) {
    return `missing type, public key, signature or payload in ${sig}`;
  }

  const { publicKey, payload, type, signature } = sig;

  const publicKeyBytes = Buffer.from(publicKey, 'base64');
  if (publicKeyBytes.length !== nacl.publicKeyLength) {
    return `public key length must be ${nacl.publicKeyLength}, got ${publicKeyBytes.length}`;
  }

  const signatureBytes = Buffer.from(signature, 'base64');
  if (signatureBytes.length !== nacl.signatureLength) {
    return `signature length must be ${nacl.signatureLength}, got ${signatureBytes.length}`;
  }

  if (!handledKeyFormats.includes(type.toLowerCase())) {
    return `signature type [${type}] is not handled: use one of [${handledKeyFormats}]`;
  }

  const signedData = search(link, payload).filter(Boolean);
  if (!signedData || signedData.length === 0) {
    return `jmespath query ${payload} did not match any data`;
  }

  const signedDataBytes = Buffer.from(stringify(signedData));
  if (!nacl.detached.verify(signedDataBytes, signatureBytes, publicKeyBytes)) {
    return 'signature do not match public key';
  }

  return null;
}

export default class SegmentValidator {
  constructor(segment) {
    this.segment = segment;
  }

  validate(errors) {
    errors.linkHash.push(this.validateLinkHash());
    errors.stateHash.push(this.validateStateHash());
    errors.merklePath.push(this.validateEvidences());
    errors.fossil.push(this.validateFossils());
    errors.signatures.push(this.validateSignatures());
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
    if (this.segment.link.state && this.segment.link.meta.stateHash) {
      const computed = hashJson(this.segment.link.state);
      const actual = this.segment.link.meta.stateHash;
      if (computed !== actual) {
        return `StateHash computed: ${computed}, Found: ${actual}`;
      }
    }
    return null;
  }

  validateEvidences() {
    const { evidences } = this.segment.meta;
    let errors = [];
    if (evidences) {
      errors = evidences
        .map(e => {
          if (e.backend === 'bcbatch') {
            return validateMerklePath(e, this.segment.meta.linkHash);
          }
          return null;
        })
        .filter(err => err != null);
    }
    return errors.length > 0 ? errors[0] : null;
  }

  validateFossils() {
    const { evidences } = this.segment.meta;
    let errors = [];
    if (evidences) {
      errors = evidences
        .map(e => {
          if (e.backend === 'bcbatch') {
            return validateFossil(e);
          }

          return null;
        })
        .filter(err => err != null);
    }
    return errors.length > 0 ? errors[0] : null;
  }

  validateSignatures() {
    const { signatures } = this.segment.link;
    let errors = [];
    if (signatures) {
      if (!Array.isArray(signatures)) {
        return `segment.link.signatures should be an array, got ${signatures}`;
      }
      errors = signatures
        .map(sig => validateSignature(sig, this.segment.link))
        .filter(err => err != null);
    }
    return errors.length > 0 ? errors[0] : null;
  }
}
