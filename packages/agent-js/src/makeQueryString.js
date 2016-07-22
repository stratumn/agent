/**
 * Makes a query string.
 * @param {object} obj - an object of keys
 * @returns {string} a query string
 */
export default function makeQueryString(obj) {
  const parts = Object.keys(obj).reduce((curr, key) => {
    const val = Array.isArray(obj[key]) ? obj[key].join(',') : obj[key];
    curr.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
    return curr;
  }, []);

  if (parts.length) {
    return `?${parts.join('&')}`;
  }

  return '';
}
