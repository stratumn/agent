/**
 * Parses function arguments from a request body.
 * @param {object} body - the request body
 * @returns {array} the function arguments
 */
export default function parseArgs(body) {
  if (!body) {
    return [];
  }

  if (Array.isArray(body)) {
    return body;
  }

  if (typeof body !== 'object' || Object.keys(body).length > 0) {
    return [body];
  }

  return [];
}
