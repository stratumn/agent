/*
  Copyright 2018 Stratumn SAS. All rights reserved.

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

import { promiseWhile } from '@stratumn/utils';
import uuid from 'uuid';
import processify from './processify';
import getActionsInfo from './getActionsInfo';
import getPluginsInfo from './getPluginsInfo';
import hashJson from './hashJson';
import filterAsync from './filterAsync';

export default class Process {
  constructor(name, actions, storeClient, fossilizerClients, opts = {}) {
    this.name = name;
    this.actions = actions;
    this.storeClient = storeClient;

    if (fossilizerClients) {
      this.fossilizerClients =
        fossilizerClients instanceof Array
          ? fossilizerClients
          : [fossilizerClients];
    } else {
      this.fossilizerClients = null;
    }
    this.plugins = opts.plugins || [];
    this.agentUrl = opts.agentUrl || '';
    this.processInfo = {
      actions: getActionsInfo(actions),
      pluginsInfo: getPluginsInfo(this.plugins)
    };
  }

  /**
  * Extracts filters from plugins
  * @returns {function[]} - An array of the filter function bound to their plugin
  */
  extractFilters() {
    return this.plugins
      .slice()
      .reverse()
      .map(p => p.filterSegment && p.filterSegment.bind(p))
      .filter(n => n);
  }

  /**
  * Applies filters from plugins to a segment
  * @param {object} - A segment to be filtered
  * @returns {Promise} - A promise that resolves to true if the segment has passed all filters.
  */
  filterSegment(segment) {
    return this.extractFilters().reduce(
      (cur, filter) => cur.then(ok => Promise.resolve(ok && filter(segment))),
      Promise.resolve(true)
    );
  }

  /**
  * Applies filters from plugins to a link
  * @param {object} - A segment to be filtered
  * @returns {Promise} - A promise that resolves to true if the segment has passed all filters.
  */
  filterLink(link) {
    return this.extractFilters().reduce(
      (cur, filter) => cur.then(ok => Promise.resolve(ok && filter({ link }))),
      Promise.resolve(true)
    );
  }

  /**
   *
   * @param {object[]} segments - An array of segments to be filtered
   * @returns {Promise} - A promise that resolves with the list of segments that passed all filters.
   */
  filterSegments(segments) {
    return this.extractFilters().reduce(
      (cur, f) => cur.then(sgmts => filterAsync(sgmts, f)),
      Promise.resolve(segments)
    );
  }

  /**
   * Fossilize the link of the given segment
   * @param {object} segment - The segment containing the link to be fossilized
   * @returns {object} - the segment
   */
  fossilizeLink(segment) {
    if (this.fossilizerClients) {
      const { link } = segment;
      const linkHash = hashJson(link);
      this.fossilizerClients.forEach(fossilizer =>
        fossilizer.fossilize(linkHash, this.name).then(() => link)
      );
    }
    return segment;
  }

  saveAndFossilize(link) {
    return this.storeClient
      .createLink(link)
      .then(this.fossilizeLink.bind(this));
  }

  applyPlugins(method, ...args) {
    // execute all plugins sequentially
    return this.plugins.reduce(
      (cur, plugin) =>
        cur.then(() =>
          Promise.resolve(plugin[method] && plugin[method](...args))
        ),
      Promise.resolve()
    );
  }

  /**
  * Gets information about the process.
  * @returns {Promise} - a promise that resolves with the information
  */
  getInfo() {
    const infos = { name: this.name, processInfo: this.processInfo };
    return this.storeClient.getInfo().then(storeInfo => {
      if (this.fossilizerClients) {
        const fossilizersInfo = this.fossilizerClients.map(f => f.getInfo());
        return Promise.all(fossilizersInfo).then(res =>
          res.reduce((map, fossilizerInfo) => {
            map.fossilizersInfo.push(fossilizerInfo);
            return map;
          }, Object.assign(infos, { fossilizersInfo: [], storeInfo }))
        );
      }
      return Object.assign(infos, { storeInfo });
    });
  }

  /**
   * Creates the first segment of a map, calling the #init() function of the agent.
   * @param {object[]} [signatures] - the optional list of signatures of the new segment
   * @param {object[]} [refs] - the optional list of references of the new map
   * @param {string} [refs.process] - ref process name from the same store
   * @param {string} [refs.linkHash] - ref linkHash from the same store
   * @param {string} [refs.meta] - ref type of relation
   * @param {...} args - the arguments to pass to the init function
   * @returns {Promise} - a promise that resolve with the segment
   */
  createMap(signatures, refs, ...args) {
    const initialLink = { meta: { mapId: uuid.v4() } };
    let link;
    return processify(
      this.actions,
      initialLink,
      signatures,
      refs,
      this.storeClient.getSegment
    )
      .init(...args)
      .catch(err => {
        err.status = 400;
        throw err;
      })
      .then(l => {
        link = l;
        link.meta.process = this.name;
        return this.applyPlugins('didCreateLink', link, 'init', args);
      })
      .then(() => this.saveAndFossilize(link));
  }

  /**
   * Appends a segment to a map.
   * @param {string} prevLinkHash - the previous link hash
   * @param {string} action - the name of the transition function to call
   * @param {object[]} [signatures] - the optional list of signatures of the new segment
   * @param {object[]} [refs] - the optional list of references of the new segment
   * @param {string} [refs.process] - ref process name from the same store
   * @param {string} [refs.linkHash] - ref linkHash from the same store
   * @param {string} [refs.meta] - ref type of relation
   * @param {...} args - the arguments to pass to the transition function
   * @returns {Promise} - a promise that resolve with the segment
   */
  createSegment(prevLinkHash, action, signatures, refs, ...args) {
    if (!this.actions[action]) {
      const err = new Error('not found');
      err.status = 404;
      return Promise.reject(err);
    }

    let initialLink;
    let createdLink;

    return this.storeClient
      .getSegment(this.name, prevLinkHash)
      .then(s => {
        initialLink = s.link;
        return this.applyPlugins('willCreate', initialLink, action, args);
      })
      .then(() => {
        delete initialLink.meta.prevLinkHash;
        initialLink.meta.prevLinkHash = prevLinkHash;
        const process = processify(
          this.actions,
          initialLink,
          signatures,
          refs,
          this.storeClient.getSegment
        );
        return process[action](...args).catch(err => {
          err.status = 400;
          throw err;
        });
      })
      .then(link => {
        createdLink = link;
        createdLink.meta.process = this.name;
        return this.applyPlugins('didCreateLink', link, action, args);
      })
      .then(() => this.saveAndFossilize(createdLink));
  }

  /**
   * Saves an evidence.
   * @param {string} linkHash - the link hash
   * @param {object} evidence - evidence to insert
   * @returns {Promise} - a promise that resolve with the evidence
   */
  saveEvidence(linkHash, evidence) {
    return this.storeClient
      .saveEvidence(evidence, linkHash)
      .then(() => evidence);
  }

  /**
   * Gets a segment.
   * @param {string} linkHash - the link hash
   * @returns {Promise} - a promise that resolve with the segment
   */
  getSegment(linkHash) {
    let segment;
    return this.storeClient
      .getSegment(this.name, linkHash)
      .then(s => {
        segment = s;
        return this.filterSegment(s);
      })
      .then(ok => {
        if (ok) {
          return segment;
        }
        const error = new Error('forbidden');
        error.status = 403;
        error.statusCode = 403;
        throw error;
      });
  }

  /**
   * The structure returned by findSegments containing segments found and other info related to pagination.
   * @typedef {Object} FindSegmentsResult
   * @property {object[]} segments - an array of segments found
   * @property {boolean} hasMore - a boolean indicating if there are more segments to be fetched
   * @property {number} totalCount - a number indicating the total count of segments before pagination
   * @property {number} offset - a number indicating the offset to use in the next search
   */

  /**
   * Finds segments.
   * @param {object} [opts] - filtering options
   * @param {number} [opts.offset] - offset of the first segment to return
   * @param {number} [opts.limit] - maximum number of segments to return
   * @param {string[]} [opts.mapIds] - an array of map IDs the segments must have
   * @param {string} [opts.prevLinkHash] - a previous link hash the segments must have
   * @param {string[]} [opts.linkHashes] - an array of linkHashes the segments must have
   * @param {string[]} [opts.tags] - an array of tags the segments must have
   * @returns {Promise(FindSegmentsResult)} - a promise that resolves with a FindSegmentResult object
   */
  findSegments(opts = {}) {
    let { offset = 0, limit = 20 } = opts;
    // when using http api, offset and limit can be strings..
    offset = Number(offset);
    limit = Number(limit);
    const firstArg = {
      segments: [],
      offset,
      limit,
      hasMore: true
    };
    const condition = ({ hasMore, segments }) =>
      hasMore && segments.length < limit;
    const findSegmentsChunk = arg => {
      const options = { ...opts, offset: arg.offset, limit: arg.limit };
      let beforeFilter;
      let totalCount;
      return this.storeClient
        .findSegments(this.name, options)
        .then(({ segments: s, totalCount: count }) => {
          beforeFilter = s.length;
          totalCount = count;
          return this.filterSegments(s);
        })
        .then(filteredSegments => ({
          segments: [...arg.segments, ...filteredSegments],
          hasMore: beforeFilter === arg.limit,
          totalCount,
          offset: arg.offset + arg.limit,
          limit: limit - arg.segments.length - filteredSegments.length
        }));
    };
    return promiseWhile(condition, findSegmentsChunk, firstArg).then(
      // filter out limit, impl detail
      ({ limit: na, ...result }) => result
    );
  }

  /**
  * Gets map IDs.
  * @param {object} [opts] - pagination options
  * @param {number} [opts.offset] - offset of the first map ID to return
  * @param {number} [opts.limit] - maximum number of map IDs to return
  * @returns {Promise} - a promise that resolve with the map IDs
  */
  getMapIds(opts) {
    return this.storeClient.getMapIds(this.name, opts);
  }
}
