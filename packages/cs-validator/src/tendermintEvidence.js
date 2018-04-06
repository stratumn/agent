/*
  Copyright 2018 Stratumn SAS. All rights reserved.

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

import sha256 from 'js-sha256';
import { Buffer } from 'buffer';

import { validateMerklePath } from './merkle';

function validateAppHash(evidence) {
  const expected = sha256(
    Buffer.concat([
      Buffer.from(evidence.proof.header.app_hash, 'hex'),
      Buffer.from(evidence.proof.validations_hash, 'hex'),
      Buffer.from(evidence.proof.merkle_root, 'hex')
    ])
  );

  return (
    expected.toUpperCase() === evidence.proof.next_header.app_hash.toUpperCase()
  );
}

export default function verifyTendermintEvidence(evidence, linkHash) {
  if (!validateAppHash(evidence)) {
    return 'invalid app hash';
  }

  if (
    validateMerklePath(
      linkHash,
      evidence.proof.merkle_root,
      evidence.proof.merkle_path
    ) !== null
  ) {
    return 'invalid merkle path';
  }

  // We should also validate the validator set and their signatures.
  // Unfortunately Tendermint uses go-wire to serialize validators before hashing,
  // and they don't provide an up-to-date js-wire package.
  // https://github.com/tendermint/js-wire/issues/1

  return null;
}
