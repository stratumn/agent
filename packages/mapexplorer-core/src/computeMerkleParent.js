import crypto from 'crypto-browserify';

export default function computeMerkleParent(left, right) {
  if (right) {
    const hash = crypto.createHash('sha256');
    return hash.update(
      Buffer.concat([new Buffer(left, 'hex'), new Buffer(right, 'hex')])
    ).digest('hex');
  }
  return left;
}
