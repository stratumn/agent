import crypto from 'crypto';

/**
 * Generates a secret from a link hash and salt.
 * @param {string} linkHash - the link hash
 * @param {string} salt - the salt
 * @returns {string} the secret
 */
export default function generateSecret(linkHash, salt) {
  return crypto
    .createHash('sha256')
    .update(`${salt}:${linkHash}`)
    .digest('hex');
}
