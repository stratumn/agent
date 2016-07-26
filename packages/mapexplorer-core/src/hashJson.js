import crypto from 'crypto-browserify';
import stringify from 'canonical-json';

/**
 * Canonically hashes a json object.
 * @param {Object} obj the json object
 */
export default function hashJson(obj) {
  return crypto
    .createHash('sha256')
    .update(stringify(obj))
    .digest('hex');
}
