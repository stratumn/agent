import crypto from 'crypto';
import stringify from 'canonical-json';

/**
 * Canonically hashes a json object.
 * @param {Object} obj - the json object
 * @returns {Promise} a promise that resolve with the hash.
 */
export default function hashJson(obj) {
  return crypto
    .createHash('sha256')
    .update(stringify(obj))
    .digest('hex');
}
