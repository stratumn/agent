import request from 'superagent';
import makeQueryString from './makeQueryString';
import handleResponse from './handleResponse';

/**
 * Creates a store HTTP client.
 * @param {string} url - the base URL of the store
 * @returns {Client} a store HTTP client
 */
export default function storeHttpClient(url) {
  return {
    /**
     * Gets information about the store.
     * @returns {Promise} a promise that resolve with the information
     */
    getInfo() {
      return new Promise((resolve, reject) => {
        request
          .get(`${url}/`)
          .end((err, res) => handleResponse(err, res).then(resolve).catch(reject));
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
          .end((err, res) => handleResponse(err, res).then(resolve).catch(reject));
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
          .end((err, res) => handleResponse(err, res).then(resolve).catch(reject));
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
          .del(`${url}/segments/${linkHash}`)
          .end((err, res) => handleResponse(err, res).then(resolve).catch(reject));
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
          .end((err, res) => handleResponse(err, res).then(resolve).catch(reject));
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
          .end((err, res) => handleResponse(err, res).then(resolve).catch(reject));
      });
    }
  };
}
