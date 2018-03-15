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

import sha256 from 'js-sha256';
import { Buffer } from 'buffer';

export function computeMerkleParent(left, right) {
  if (right) {
    return sha256(
      Buffer.concat([Buffer.from(left, 'hex'), Buffer.from(right, 'hex')])
    );
  }
  return left;
}

export function validateMerklePath(linkHash, root, path) {
  let previous = linkHash;

  let error;
  path.every(merkleNode => {
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

  if (path.length > 0) {
    const lastMerkleNode = path[path.length - 1];
    if (lastMerkleNode.parent !== root) {
      return `Invalid Merkle Root ${root}: not found in Merkle Path`;
    }
  }
  return null;
}
