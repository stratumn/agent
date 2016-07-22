import getAgentInfo from './getAgentInfo';

/**
 * Creates an agent.
 * @param {object} transitions - the transition function
 * @param {StoreClient} storeClient - the store client
 * @returns {Client} a store HTTP client
 */
export default function agent(transitions, storeClient) {
  const agentInfo = getAgentInfo(transitions);

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
