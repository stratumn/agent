/*
  Copyright 2017 Stratumn SAS. All rights reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import EventEmitter from 'events';
import hashJson from './hashJson';
import { STORE_SAVED_LINKS } from './eventTypes';

// Default value for the pagination limit
const STORE_DEFAULT_LIMIT = 20;

// Max value for the pagination limit
const STORE_MAX_LIMIT = 200;

const paginateResults = (results, opts) => {
  let res = [...results];
  if (opts.offset) {
    res = res.slice(opts.offset);
  }

  if (opts.limit) {
    if (opts.limit > STORE_MAX_LIMIT) {
      const err = new Error(`maximum limit should be ${STORE_MAX_LIMIT}`);
      err.status = 400;
      return Promise.reject(err);
    }
    res = res.slice(0, opts.limit);
  } else {
    res = res.slice(0, STORE_DEFAULT_LIMIT);
  }
  return res;
};

/**
 * Creates a memory store, for testing only.
 * @returns {Client} a memory store
 */
export default function memoryStore() {
  const segments = {};
  const evidences = {};

  const emitter = Object.assign(new EventEmitter(), {
    /**
     * Does nothing since memory store doesn't use a web socket.
     */
    connect() {},

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
     * Creates link.
     * @param {object} link - the link
     * @returns {Promise} a promise that resolves with the segment
     */
    createLink(link) {
      const linkHash = hashJson(link);
      const meta = { linkHash, evidences: [] };
      const segment = { link, meta };

      segments[linkHash] = JSON.parse(JSON.stringify(segment));
      emitter.emit('message', {
        type: STORE_SAVED_LINKS,
        data: [link]
      });
      emitter.emit.bind(emitter, STORE_SAVED_LINKS, [link]);
      return Promise.resolve(segment);
    },

    /**
     * Gets a segment.
     * @param {String} process - process from which we want to get the segments
     * @param {string} linkHash - the link hash
     * @returns {Promise} a promise that resolve with the segment
     */
    getSegment(process, linkHash) {
      const segment = segments[linkHash];
      if (!segment || segment.link.meta.process !== process) {
        const err = new Error('not found');
        err.status = 404;
        return Promise.reject(err);
      }

      return Promise.resolve(JSON.parse(JSON.stringify(segment)));
    },

    /**
     * Finds segments.
     * @param {String} process - process from which we want to get the segments
     * @param {object} [opts] - filtering options
     * @param {number} [opts.offset] - offset of the first segment to return
     * @param {number} [opts.limit] - maximum number of segments to return
     * @param {string[]} [opts.mapIds] - an array of map IDs the segments must have
     * @param {string} [opts.prevLinkHash] - a previous link hash the segments must have
     * @param {string[]} [opts.linkHashes] - an array of linkHashes the segments must have
     * @param {string[]} [opts.tags] - an array of tags the segments must have
     * @returns {Promise} a promise that resolve with the segments
     */
    findSegments(process, opts = {}) {
      let a = [];

      Object.keys(segments).forEach(linkHash => {
        const segment = segments[linkHash];

        if (segment.link.meta.process !== process) {
          return;
        }

        if (opts.mapIds && opts.mapIds.indexOf(segment.link.meta.mapId) < 0) {
          return;
        }

        if (
          opts.prevLinkHash &&
          segment.link.meta.prevLinkHash !== opts.prevLinkHash
        ) {
          return;
        }

        if (
          opts.linkHashes &&
          opts.linkHashes.length > 0 &&
          !opts.linkHashes.includes(linkHash)
        ) {
          return;
        }

        if (opts.tags) {
          const segmentTags = segment.link.meta.tags;

          if (!segmentTags) {
            return;
          }

          for (let i = 0; i < opts.tags.length; i += 1) {
            if (segmentTags.indexOf(opts.tags[i]) < 0) {
              return;
            }
          }
        }

        a.push(JSON.parse(JSON.stringify(segment)));
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

      a = paginateResults(a, opts);
      return Promise.resolve(a);
    },

    /**
     * Gets map IDs.
     * @param {String} process - process from which we want to get the segments
     * @param {object} [opts] - pagination options
     * @param {number} [opts.offset] - offset of the first map ID to return
     * @param {number} [opts.limit] - maximum number of map IDs to return
     * @returns {Promise} a promise that resolve with the map IDs
     */
    getMapIds(process, opts = {}) {
      const m = {};
      const filteredSegments = Object.values(segments).filter(
        s => s.link.meta.process === process
      );

      filteredSegments.forEach(s => {
        m[segments[s.meta.linkHash].link.meta.mapId] = true;
      });

      const a = paginateResults(Object.keys(m), opts);
      return Promise.resolve(a);
    },

    /**
   * Saves an evidence.
   * @param {string} linkHash - the link hash
   * @param {object} evidence - evidence to insert
   * @returns {Promise} - a promise that resolve with the evidence
   */
    saveEvidence(linkHash, evidence) {
      evidences[linkHash] = evidence;
      return Promise.resolve(evidence);
    }
  });

  return emitter;
}
