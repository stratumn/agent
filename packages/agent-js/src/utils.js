// String manipulation
/**
 * Converts a base64 encoded string to its Unicode representation
 * @param {string} str - The string to be converted
 * @returns {string} - The unicode string
 */
const base64ToUnicode = str => Buffer.from(str, 'base64').toString('utf8');

/**
 * Converts a base64 encoded string to its Hexadecimal representation
 * @param {string} str - The string to be converted
 * @returns {string} - The hexadecimal representation
 */
const base64ToHex = str => Buffer.from(str, 'base64').toString('hex');

// Object manipulation
/**
 * Get a value from an object given a deep path
 * @param {object} obj - The object
 * @param {string} path - The path looks like "k1.k2.k3"
 * @param {} defaultValue - returned if path not in obj. 
 * @returns {} - The value at obj.k1.k2.k3 or defaultValue
 */
const deepGet = (obj, path, defaultValue = null) => {
  if (!path.length) return obj;
  const spath = path.split('.');
  if (spath[0] in obj) return deepGet(obj[spath[0]], spath.slice(1).join('.'));
  return defaultValue;
};

module.exports = {
  deepGet,
  base64ToHex,
  base64ToUnicode
};
