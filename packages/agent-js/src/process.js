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
import getDefinedFilters from './getDefinedFilters';

const QUEUED = 'QUEUED';
const COMPLETE = 'COMPLETE';

export default class Process {

  constructor(name, actions, storeClient, fossilizerClient, opts = {}) {
    this.name = name;
    this.actions = actions;
    this.storeClient = storeClient;
    this.fossilizerClient = fossilizerClient;
    this.salt = opts.salt || '';
    this.plugins = opts.plugins || [];
    this.evidenceCallbackUrl = opts.evidenceCallbackUrl || '';
    this.agentUrl = opts.agentUrl || '';
    this.processInfo = {
      actions: getActionsInfo(actions),
      pluginsInfo: getPluginsInfo(this.plugins)
    };
  }

  fossilizeSegment(segment) {
    if (this.fossilizerClient) {
      const linkHash = segment.meta.linkHash;
      const secret = generateSecret(linkHash, this.salt || '');
      let callbackUrl = `${this.evidenceCallbackUrl ||
        this.agentUrl}/${this.name}/evidence/${linkHash}`;
      callbackUrl += makeQueryString({ secret });
      return this.fossilizerClient
        .fossilize(linkHash, callbackUrl)
        .then(() => segment);
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
      (cur, plugin) => cur.then(() => Promise.resolve(plugin[method] && plugin[method](...args))),
      Promise.resolve());
  }

  /**
  * Gets information about the process.
  * @returns {Promise} - a promise that resolve with the information
  */
  getInfo() {
    const processInfo = this.processInfo;
    return this.storeClient
      .getInfo()
      .then(storeInfo => {
        if (this.fossilizerClient) {
          return this.fossilizerClient
            .getInfo()
            .then(fossilizerInfo =>
              ({ name: this.name, processInfo, storeInfo, fossilizerInfo }));
        }
        return { name: this.name, processInfo, storeInfo };
      });
  }

  /**
   * Creates the first segment of a map, calling the #init() function of the agent.
   * @param {...} args - the arguments to pass to the init function
   * @returns {Promise} - a promise that resolve with the segment
   */
  createMap(...args) {
    const initialLink = { meta: { mapId: uuid.v4() } };
    let link;
    let segment;
    return processify(this.actions, initialLink)
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

        const meta = Object.assign({ linkHash },
          this.fossilizerClient ? { evidence: { state: QUEUED } } : {});

        segment = { link, meta };
        return this.applyPlugins('didCreateSegment', segment, 'init', args);
      })
      .then(() => this.saveAndFossilize(segment));
  }

  /**
   * Appends a segment to a map.
   * @param {string} prevLinkHash - the previous link hash
   * @param {string} action - the name of the transition function to call
   * @param {...} args - the arguments to pass to the transition function
   * @returns {Promise} - a promise that resolve with the segment
   */
  createSegment(prevLinkHash, action, ...args) {
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
        return processify(this.actions, initialLink)[action](...args)
          .catch(err => {
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
        const meta = Object.assign({ linkHash },
          this.fossilizerClient ? { evidence: { state: QUEUED } } : {});

        segment = { link: createdLink, meta };
        return this.applyPlugins('didCreateSegment', segment, action, args);
      })
      .then(() => this.saveAndFossilize(segment));
  }

  /**
   * Inserts evidence.
   * @param {string} linkHash - the link hash
   * @param {object} evidence - evidence to insert
   * @param {strint} secret - a secret
   * @returns {Promise} - a promise that resolve with the segment
   */
  insertEvidence(linkHash, evidence, secret) {
    const expected = generateSecret(linkHash, this.salt);

    if (secret !== expected) {
      const err = new Error('unauthorized');
      err.status = 401;
      return Promise.reject(err);
    }

    // Not atomic. Not an issue at the moment, but it could
    // become one in the future, for instance if there can be
    // more than one fossilizers? Could it be solved by adding
    // an insertEvidence route to stores?
    return this.storeClient
      .getSegment(this.name, linkHash)
      .then(segment => {
        Object.assign(segment.meta.evidence, evidence, {
          state: COMPLETE
        });
        return this.storeClient.saveSegment(segment);
      })
      .then(segment => {
        // Call didFossilize event if present.
        if (typeof this.actions.events === 'object' &&
          typeof this.actions.events.didFossilize === 'function') {
          processify(this.actions, segment.link).events.didFossilize(segment);
        }

        return segment;
      });
  }
  /**
   * Gets a segment.
   * @param {string} linkHash - the link hash
   * @returns {Promise} - a promise that resolve with the segment
   */
  getSegment(linkHash) {
    return this.storeClient.getSegment(this.name, linkHash, getDefinedFilters(this.plugins));
  }

  /**
   * Finds segments.
   * @param {object} [opts] - filtering options
   * @param {number} [opts.offset] - offset of the first segment to return
   * @param {number} [opts.limit] - maximum number of segments to return
   * @param {string[]} [opts.mapIds] - an array of map IDs the segments must have
   * @param {string} [opts.prevLinkHash] - a previous link hash the segments must have
   * @param {string[]} [opts.tags] - an array of tags the segments must have
   * @returns {Promise} - a promise that resolve with the segments
   */
  findSegments(opts) {
    const options = opts;
    if (options.mapId) {
      options.mapIds = options.mapId;
      delete options.mapId;
    }
    return this.storeClient.findSegments(this.name, options, getDefinedFilters(this.plugins));
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
