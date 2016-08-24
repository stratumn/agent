import stringify from 'canonical-json';
import sha256 from 'js-sha256';

/**
 * Canonically hashes a json object.
 * @param {Object} obj the json object
 */
export default function hashJson(obj) {
  return sha256(stringify(obj));
}
