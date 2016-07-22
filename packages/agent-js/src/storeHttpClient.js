import superagent from 'superagent';
import makeQueryString from './makeQueryString';

function handleResponse(resolve, reject, err, res) {
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
}

/**
 * Creates a store HTTP client.
 * @param {string} url - the base URL of the store
 * @param {function} [request] - a request function (superagent or supertest)
 * @returns {Client} a store HTTP client
 */
export default function storeHttpClient(url, request) {
  /*eslint-disable*/
  request = request || superagent;
  /*eslint-enable*/

  return {
    /**
     * Gets information about the store.
     * @returns {Promise} a promise that resolve with the information
     */
    getInfo() {
      return new Promise((resolve, reject) => {
        request
          .get(url)
          .end(handleResponse.bind(null, resolve, reject));
      });
    },

    /**
     * Creates or updates a segment.
     * @param {object} segment - the segment
     * @returns {Promise} a promise that resolve with the segment
     */
    saveSegment(segment) {
      return new Promise((resolve, reject) => {
        request
          .post(`${url}/segments`)
          .send(segment)
          .end(handleResponse.bind(null, resolve, reject));
      });
    },

    /**
     * Gets a segment.
     * @param {string} linkHash - the link hash
     * @returns {Promise} a promise that resolve with the segment
     */
    getSegment(linkHash) {
      return new Promise((resolve, reject) => {
        request
          .get(`${url}/segments/${linkHash}`)
          .end(handleResponse.bind(null, resolve, reject));
      });
    },

    /**
     * Deletes a segment.
     * @param {string} linkHash - the link hash
     * @returns {Promise} a promise that resolve with the segment
     */
    deleteSegment(linkHash) {
      return new Promise((resolve, reject) => {
        request
          .delete(`${url}/segments/${linkHash}`)
          .end(handleResponse.bind(null, resolve, reject));
      });
    },

    /**
     * Finds segments.
     * @param {object} [opts] - filtering options
     * @param {number} [opts.offset] - offset of the first segment to return
     * @param {number} [opts.limit] - maximum number of segments to return
     * @param {string} [opts.mapId] - a map ID the segments must have
     * @param {string} [opts.prevLinkHash] - a previous link hash the segments must have
     * @param {string[]} [opts.tags] - an array of tags the segments must have
     * @returns {Promise} a promise that resolve with the segments
     */
    findSegments(opts) {
      return new Promise((resolve, reject) => {
        request
          .get(`${url}/segments${makeQueryString(opts || {})}`)
          .end(handleResponse.bind(null, resolve, reject));
      });
    },

    /**
     * Gets map IDs.
     * @param {object} [opts] - pagination options
     * @param {number} [opts.offset] - offset of the first map ID to return
     * @param {number} [opts.limit] - maximum number of map IDs to return
     * @returns {Promise} a promise that resolve with the map IDs
     */
    getMapIds(opts) {
      return new Promise((resolve, reject) => {
        request
          .get(`${url}/maps${makeQueryString(opts || {})}`)
          .end(handleResponse.bind(null, resolve, reject));
      });
    }
  };
}
