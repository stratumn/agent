/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import uuid from 'uuid';
import { mockAgent } from 'stratumn-mock-agent';
import getActionsInfo from './getActionsInfo';
import getPluginsInfo from './getPluginsInfo';
import hashJson from './hashJson';
import makeQueryString from './makeQueryString';
import generateSecret from './generateSecret';
import getDefinedFilters from './getDefinedFilters';

const QUEUED = 'QUEUED';
const DISABLED = 'DISABLED';
const COMPLETE = 'COMPLETE';

/**
 * Creates an agent.
 * @param {object} actions - the action functions
 * @param {StoreClient} storeClient - the store client
 * @param {FossilizerClient} [fossilizerClient] - the fossilizer client
 * @param {object} [opts] - options
 * @param {string} [opts.agentUrl] - agent root url
 * @param {string} [opts.evidenceCallbackUrl] - evidence callback root url
 * @param {string} [opts.salt] - a unique salt
 * @param {number} [opts.reconnectTimeout=5000] - web socket reconnect timeout in milliseconds
 * @param {Plugins[]} [opts.plugins] - a list of agent plugins
 * @returns {Agent} an agent
 */
export default function create(actions, storeClient, fossilizerClient, opts = {}) {
  const plugins = opts.plugins || [];
  const agentInfo = { actions: getActionsInfo(actions), pluginsInfo: getPluginsInfo(plugins) };

  function fossilizeSegment(segment) {
    if (fossilizerClient) {
      const linkHash = segment.meta.linkHash;
      const secret = generateSecret(linkHash, opts.salt || '');
      let callbackUrl = `${opts.evidenceCallbackUrl || opts.agentUrl}/evidence/${linkHash}`;
      callbackUrl += makeQueryString({ secret });

      return fossilizerClient
        .fossilize(linkHash, callbackUrl)
        .then(() => segment);
    }

    return segment;
  }

  function saveSegment(segment) {
    return storeClient
      .saveSegment(segment)
      .then(fossilizeSegment);
  }

  // Set up events.
  storeClient.on('open', () => console.log('store: web socket open'));
  storeClient.on('close', () => console.log('store: web socket closed'));
  storeClient.on('error', err => console.error(`store: ${err.stack}`));
  storeClient.on('message', msg => {
    const name = msg.type;
    if (typeof actions.events === 'object' && typeof actions.events[name] === 'function') {
      const segment = msg.data;
      if (getDefinedFilters(plugins).every(filter => filter(segment))) {
        actions.events[name](segment);
      }
    }
  });

  // Connect to store web socket.
  storeClient.connect(opts.reconnectTimeout || 5000);

  function applyPlugins(method, ...args) {
    plugins.forEach(plugin =>
      (plugin[method] && plugin[method](...args))
    );
  }

  return {
    /**
     * Gets information about the agent.
     * @returns {Promise} a promise that resolve with the information
     */
    getInfo() {
      return storeClient
        .getInfo()
        .then(storeInfo => {
          if (fossilizerClient) {
            return fossilizerClient
              .getInfo()
              .then(fossilizerInfo => ({ agentInfo, storeInfo, fossilizerInfo }));
          }

          return { agentInfo, storeInfo };
        });
    },

    /**
     * Creates the first segment of a map, calling the #init() function of the agent.
     * @param {...} args - the arguments to pass to the init function
     * @returns {Promise} a promise that resolve with the segment
     */
    createMap(...args) {
      const initialLink = { meta: { mapId: uuid.v4() } };

      return mockAgent(actions, initialLink)
        .init(...args)
        .catch(err => {
          err.status = 400;
          throw err;
        })
        .then(link => {
          applyPlugins('didCreateLink', link, 'init', args);

          const linkHash = hashJson(link);

          const meta = {
            linkHash,
            evidence: { state: fossilizerClient ? QUEUED : DISABLED }
          };

          const segment = { link, meta };

          applyPlugins('didCreateSegment', segment, 'init', args);

          return saveSegment(segment);
        });
    },

    /**
     * Appends a segment to a map.
     * @param {string} prevLinkHash - the previous link hash
     * @param {string} action - the name of the transition function to call
     * @param {...} args - the arguments to pass to the transition function
     * @returns {Promise} a promise that resolve with the segment
     */
    createSegment(prevLinkHash, action, ...args) {
      if (!actions[action]) {
        const err = new Error('not found');
        err.status = 404;
        return Promise.reject(err);
      }

      return storeClient
        .getSegment(prevLinkHash)
        .then(segment => {
          const initialLink = segment.link;

          applyPlugins('willCreate', initialLink, action, args);

          delete initialLink.meta.prevLinkHash;
          initialLink.meta.prevLinkHash = prevLinkHash;

          return mockAgent(actions, initialLink)[action](...args)
            .catch(err => {
              err.status = 400;
              throw err;
            });
        })
        .then(link => {
          applyPlugins('didCreateLink', link, action, args);

          const linkHash = hashJson(link);

          const meta = {
            linkHash,
            evidence: { state: fossilizerClient ? QUEUED : DISABLED }
          };

          const segment = { link, meta };

          applyPlugins('didCreateSegment', segment, action, args);

          return saveSegment(segment);
        });
    },

    /**
     * Inserts evidence.
     * @param {string} linkHash - the link hash
     * @param {object} evidence - evidence to insert
     * @param {strint} secret - a secret
     * @returns {Promise} a promise that resolve with the segment
     */
    insertEvidence(linkHash, evidence, secret) {
      const expected = generateSecret(linkHash, opts.salt || '');

      if (secret !== expected) {
        const err = new Error('unauthorized');
        err.status = 401;
        return Promise.reject(err);
      }

      // Not atomic. Not an issue at the moment, but it could
      // become one in the future, for instance if there can be
      // more than one fossilizers? Could it be solved by adding
      // an insertEvidence route to stores?
      return storeClient
        .getSegment(linkHash)
        .then(segment => {
          Object.assign(segment.meta.evidence, evidence, {
            state: COMPLETE
          });

          return storeClient.saveSegment(segment);
        })
        .then(segment => {
          // Call didFossilize event if present.
          if (typeof actions.events === 'object' &&
              typeof actions.events.didFossilize === 'function') {
            mockAgent(actions, segment.link).events.didFossilize(segment);
          }

          return segment;
        });
    },

    /**
     * Gets a segment.
     * @param {string} linkHash - the link hash
     * @returns {Promise} a promise that resolve with the segment
     */
    getSegment(linkHash) {
      return storeClient.getSegment(linkHash, getDefinedFilters(plugins));
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
    findSegments(options) {
      return storeClient.findSegments(options, getDefinedFilters(plugins));
    },

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
