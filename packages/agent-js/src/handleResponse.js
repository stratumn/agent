/**
 * Handles an HTTP response from a store or fossilizer.
 * If there is an error and the response has an error, it will reject
 * with an appropriate error. Otherwise it resolves with the response
 * body.
 * @param {Error} err - an error
 * @param {http.Response} res - an HTTP response
 * @returns {Promise} a promise that resolve with the response body
 */
export default function handleResponse(err, res) {
  return new Promise((resolve, reject) => {
    if (res && res.body && res.body.error) {
      /*eslint-disable*/
      err = new Error(res.body.error)
      /*eslint-enable*/
    }

    if (err) {
      /*eslint-disable*/
      err.status = res ? res.statusCode : 500;
      /*eslint-enable*/
      reject(err);
      return;
    }

    resolve(res.body);
  });
}
