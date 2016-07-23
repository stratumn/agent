import uuid from 'node-uuid';
import { mockAgent } from 'stratumn-mock-agent';
import getAgentInfo from './getAgentInfo';
import hashJson from './hashJson';

/**
 * Creates an agent.
 * @param {object} transitions - the transition function
 * @param {StoreClient} storeClient - the store client
 * @returns {Client} a store HTTP client
 */
export default function create(transitions, storeClient) {
  const agentInfo = getAgentInfo(mockAgent(transitions));

  return {
    /**
     * Gets information about the agent.
     * @returns {Promise} a promise that resolve with the information
     */
    getInfo() {
      return storeClient
        .getInfo()
        .then(storeInfo => ({ agentInfo, storeInfo }));
    },

    /**
     * Creates the first segment of a map, calling the #init() function of the agent.
     * @param {...} args - the arguments to pass to the init function
     * @returns {Promise} a promise that resolve with the segment
     */
    createMap(...args) {
      const initialLink = { meta: { mapId: uuid.v4() } };

      return mockAgent(transitions, initialLink)
        .init(...args)
        .then(l => {
          const link = l;

          link.meta.stateHash = hashJson(link.state);
          link.meta.action = 'init';
          link.meta.arguments = args;

          const linkHash = hashJson(link);

          const segment = {
            link,
            meta: {
              linkHash
            }
          };

          return storeClient.saveSegment(segment);
        })
        .catch(err => {
          /*eslint-disable*/
          err.status = 400;
          /*eslint-enable*/
          throw err;
        });
    },

    /**
     * Appends a link to a map.
     * @param {string} prevLinkHash - the previous link hash
     * @param {string} action - the name of the transition function to call
     * @param {...} args - the arguments to pass to the transition function
     * @returns {Promise} a promise that resolve with the segment
     */
    createLink(prevLinkHash, action, ...args) {
      return storeClient
        .getSegment(prevLinkHash)
        .then(segment => {
          const initialLink = segment.link;

          delete initialLink.meta.stateHash;
          delete initialLink.meta.prevLinkHash;
          delete initialLink.meta.action;
          delete initialLink.meta.arguments;

          initialLink.meta.prevLinkHash = prevLinkHash;

          return mockAgent(transitions, initialLink)[action](...args);
        })
        .then(l => {
          const link = l;

          link.meta.stateHash = hashJson(link.state);
          link.meta.action = action;
          link.meta.arguments = args;

          const linkHash = hashJson(link);

          const segment = {
            link,
            meta: {
              linkHash
            }
          };

          return storeClient.saveSegment(segment);
        })
        .catch(err => {
          /*eslint-disable*/
          err.status = 400;
          /*eslint-enable*/
          throw err;
        });
    },

    /**
     * Gets a segment.
     * @param {string} linkHash - the link hash
     * @returns {Promise} a promise that resolve with the segment
     */
    getSegment: storeClient.getSegment.bind(storeClient),

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
    findSegments: storeClient.findSegments.bind(storeClient),

    /**
     * Gets map IDs.
     * @param {object} [opts] - pagination options
     * @param {number} [opts.offset] - offset of the first map ID to return
     * @param {number} [opts.limit] - maximum number of map IDs to return
     * @returns {Promise} a promise that resolve with the map IDs
     */
    getMapIds: storeClient.getMapIds.bind(storeClient)
  };
}
