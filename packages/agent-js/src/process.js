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

import uuid from 'uuid';
import processify from './processify';
import getActionsInfo from './getActionsInfo';
import getPluginsInfo from './getPluginsInfo';
import hashJson from './hashJson';
import makeQueryString from './makeQueryString';
import generateSecret from './generateSecret';
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
    this.salt = opts.salt || '';
    this.plugins = opts.plugins || [];
    this.evidenceCallbackUrl = opts.evidenceCallbackUrl || '';
    this.agentUrl = opts.agentUrl || '';
    this.processInfo = {
      actions: getActionsInfo(actions),
      pluginsInfo: getPluginsInfo(this.plugins)
    };
    this.pendingEvidences = {};
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

  fossilizeSegment(segment) {
    if (this.fossilizerClients) {
      const { linkHash } = segment.meta;
      const secret = generateSecret(linkHash, this.salt || '');
      let callbackUrl = `${this.evidenceCallbackUrl || this.agentUrl}/${this
        .name}/evidence/${linkHash}`;
      callbackUrl += makeQueryString({ secret });

      this.pendingEvidences[linkHash] = this.fossilizerClients.length;
      this.fossilizerClients.map(fossilizer =>
        fossilizer.fossilize(linkHash, callbackUrl).then(() => segment)
      );
      return segment;
    }

    return segment;
  }

  saveAndFossilize(segment) {
    return this.storeClient
      .saveSegment(segment)
      .then(this.fossilizeSegment.bind(this));
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
   * @param {object[]} [refs] - the optional list of references of the new map
   * @param {string} [refs.process] - ref process name from the same store
   * @param {string} [refs.linkHash] - ref linkHash from the same store
   * @param {object} [refs.segment] - ref linked segment from another store
   * @param {string} [refs.meta] - ref type of relation
   * @param {...} args - the arguments to pass to the init function
   * @returns {Promise} - a promise that resolve with the segment
   */
  createMap(refs, ...args) {
    const initialLink = { meta: { mapId: uuid.v4() } };
    let link;
    let segment;
    return processify(
      this.actions,
      initialLink,
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
      .then(() => {
        const linkHash = hashJson(link);
        const meta = Object.assign({ linkHash }, { evidences: [] });

        segment = { link, meta };
        return this.applyPlugins('didCreateSegment', segment, 'init', args);
      })
      .then(() => this.saveAndFossilize(segment));
  }

  /**
   * Appends a segment to a map.
   * @param {string} prevLinkHash - the previous link hash
   * @param {string} action - the name of the transition function to call
   * @param {object[]} [refs] - the optional list of references of the new segment
   * @param {string} [refs.process] - ref process name from the same store
   * @param {string} [refs.linkHash] - ref linkHash from the same store
   * @param {object} [refs.segment] - ref linked segment from another store
   * @param {string} [refs.meta] - ref type of relation
   * @param {...} args - the arguments to pass to the transition function
   * @returns {Promise} - a promise that resolve with the segment
   */
  createSegment(prevLinkHash, action, refs, ...args) {
    if (!this.actions[action]) {
      const err = new Error('not found');
      err.status = 404;
      return Promise.reject(err);
    }

    let initialLink;
    let createdLink;
    let segment;

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
      .then(() => {
        const linkHash = hashJson(createdLink);
        const meta = Object.assign({ linkHash }, { evidences: [] });

        segment = { link: createdLink, meta };
        return this.applyPlugins('didCreateSegment', segment, action, args);
      })
      .then(() => this.saveAndFossilize(segment));
  }

  /**
   * Inserts evidence.
   * @param {string} linkHash - the link hash
   * @param {object} evidence - evidence to insert
   * @param {string} secret - a secret
   * @returns {Promise} - a promise that resolve with the segment
   */
  insertEvidence(linkHash, evidence, secret) {
    const expected = generateSecret(linkHash, this.salt);

    if (secret !== expected) {
      const err = new Error('unauthorized');
      err.status = 401;
      return Promise.reject(err);
    }

    if (!this.pendingEvidences[linkHash]) {
      const err = new Error('trying to add an unexpected evidence');
      err.status = 400;
      return Promise.reject(err);
    }
    this.pendingEvidences[linkHash] -= 1;
    return this.storeClient
      .getSegment(this.name, linkHash)
      .then(segment => {
        segment.meta.evidences.push(evidence);
        return this.storeClient.saveSegment(segment);
      })
      .then(segment => {
        // If all evidences have been added, call didFossilize event if present.
        if (this.pendingEvidences[linkHash] > 0) {
          return segment;
        }

        if (
          typeof this.actions.events === 'object' &&
          typeof this.actions.events.didFossilize === 'function'
        ) {
          processify(this.actions, segment.link).events.didFossilize(segment);
        }
        delete this.pendingEvidences[linkHash];
        return segment;
      });
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
   * Finds segments.
   * @param {object} [opts] - filtering options
   * @param {number} [opts.offset] - offset of the first segment to return
   * @param {number} [opts.limit] - maximum number of segments to return
   * @param {string[]} [opts.mapIds] - an array of map IDs the segments must have
   * @param {string} [opts.prevLinkHash] - a previous link hash the segments must have
   * @param {string[]} [opts.linkHashes] - an array of linkHashes the segments must have
   * @param {string[]} [opts.tags] - an array of tags the segments must have
   * @returns {Promise} - a promise that resolve with the segments
   */
  findSegments(opts) {
    const options = opts;

    return this.storeClient
      .findSegments(this.name, options)
      .then(s => this.filterSegments(s));
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
