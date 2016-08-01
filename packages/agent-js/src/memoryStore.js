/**
 * Creates a memory store, for testing only.
 * @returns {Client} a memory store
 */
export default function memoryStore() {
  const segments = {};

  return {
    /**
     * Gets information about the store.
     * @returns {Promise} a promise that resolve with the information
     */
    getInfo() {
      return Promise.resolve({
        adapter: {
          name: 'memory',
          description: 'Stratumn memory store',
          version: '0.1.0'
        }
      });
    },

    /**
     * Creates or updates a segment.
     * @param {object} segment - the segment
     * @returns {Promise} a promise that resolve with the segment
     */
    saveSegment(segment) {
      segments[segment.meta.linkHash] = segment;
      return Promise.resolve(segment);
    },

    /**
     * Gets a segment.
     * @param {string} linkHash - the link hash
     * @returns {Promise} a promise that resolve with the segment
     */
    getSegment(linkHash) {
      const segment = segments[linkHash];

      if (!segment) {
        const err = new Error('not found');
        err.statusCode = 404;
        return Promise.reject(err);
      }

      return Promise.resolve(segment);
    },

    /**
     * Deletes a segment.
     * @param {string} linkHash - the link hash
     * @returns {Promise} a promise that resolve with the segment
     */
    deleteSegment(linkHash) {
      const segment = segments[linkHash];

      if (!segment) {
        const err = new Error('not found');
        err.statusCode = 404;
        return Promise.reject(err);
      }

      delete segments[linkHash];

      return Promise.resolve(segment);
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
    findSegments(opts = {}) {
      let a = [];

      Object.keys(segments).forEach(linkHash => {
        const segment = segments[linkHash];

        if (opts.mapId && segment.link.meta.mapId !== opts.mapId) {
          return;
        }

        if (opts.prevLinkHash && segment.link.meta.prevLinkHash !== opts.prevLinkHash) {
          return;
        }

        if (opts.tags) {
          const segmentTags = segment.link.meta.tags;

          if (!segmentTags) {
            return;
          }

          for (let i = 0; i < opts.tags.length; i++) {
            if (segmentTags.indexOf(opts.tags[i]) < 0) {
              return;
            }
          }
        }

        a.push(segment);
      });

      a.sort((l, r) => {
        if (l.link.meta.priority) {
          if (!r.link.meta.priority) {
            return -1;
          }

          return r.link.meta.priority - l.link.meta.priority;
        }

        if (r.link.meta.priority) {
          return 1;
        }

        return l.meta.linkHash.localeCompare(r.meta.linkHash);
      });

      if (opts.offset) {
        a = a.slice(opts.offset);
      }

      if (opts.limit) {
        a = a.slice(0, opts.limit);
      }

      return Promise.resolve(a);
    },

    /**
     * Gets map IDs.
     * @param {object} [opts] - pagination options
     * @param {number} [opts.offset] - offset of the first map ID to return
     * @param {number} [opts.limit] - maximum number of map IDs to return
     * @returns {Promise} a promise that resolve with the map IDs
     */
    getMapIds(opts = {}) {
      const m = {};

      Object.keys(segments).forEach(linkHash => {
        m[segments[linkHash].link.meta.mapId] = true;
      });

      let a = Object.keys(m);

      if (opts.offset) {
        a = a.slice(opts.offset);
      }

      if (opts.limit) {
        a = a.slice(0, opts.limit);
      }

      return Promise.resolve(a);
    }
  };
}
