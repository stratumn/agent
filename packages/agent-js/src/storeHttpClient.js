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
import request from 'superagent';
import WebSocket from 'ws';
import makeQueryString from './makeQueryString';
import handleResponse from './handleResponse';

/**
 * Creates a store HTTP client.
 *
 * The client is an EventEmitter and emits the following events:
 *   - 'open': the web socket connection was open
 *   - 'close': the web socket connection was closed
 *   - 'error': a web socket error occured
 *   - 'message': any message from web socket
 *   - 'SavedLinks': links were saved
 *   - 'SavedEvidences': evidences were saved
 *
 * @param {string} url - the base URL of the store
 * @returns {Client} a store HTTP client
 */
export default function storeHttpClient(url) {
  // If we already have an existing store for that url, re-use it
  if (storeHttpClient.availableStores[url]) {
    return storeHttpClient.availableStores[url];
  }

  // Web socket URL.
  const wsUrl = `${url.replace(/^http/, 'ws')}/websocket`;

  // Web socket instance.
  let ws = null;

  // Use event emitter instance as base object.
  const emitter = new EventEmitter();

  function connect(reconnectTimeout) {
    ws = new WebSocket(wsUrl);
    ws.on('open', emitter.emit.bind(emitter, 'open'));
    ws.on('close', (...args) => {
      ws.removeAllListeners();
      emitter.emit('close', ...args);
      setTimeout(connect.bind(null, reconnectTimeout), reconnectTimeout);
    });
    ws.on('error', emitter.emit.bind(emitter, 'error'));
    ws.on('message', str => {
      // Emit both event for message and event for message type.
      const msg = JSON.parse(str);
      emitter.emit('message', msg);
      emitter.emit(msg.type, msg.data);
    });
  }

  const storeClient = Object.assign(emitter, {
    /**
     * Gets information about the store.
     * @returns {Promise} a promise that resolve with the information
     */
    getInfo() {
      return new Promise((resolve, reject) => {
        request.get(`${url}/`).end((err, res) =>
          handleResponse(err, res)
            .then(resolve)
            .catch(reject)
        );
      });
    },

    /**
     * Connects to the web socket and starts emitting events.
     * @param {number} reconnectTimeout - time to wait to reconnect in milliseconds
     */
    connect(reconnectTimeout) {
      if (ws) {
        return;
      }
      connect(reconnectTimeout);
    },

    /**
     * Creates a link.
     * @param {object} link - the link
     * @returns {Promise} a promise that resolve with the segment
     */
    createLink(link) {
      return new Promise((resolve, reject) => {
        request
          .post(`${url}/links`)
          .send(link)
          .end((err, res) =>
            handleResponse(err, res)
              .then(resolve)
              .catch(reject)
          );
      });
    },

    /**
     * Gets a segment.
     * @param {string} process - name of the process from which we want the segments
     * @param {string} linkHash - the link hash
     * @returns {Promise} a promise that resolve with the segment
     */
    getSegment(process, linkHash) {
      return new Promise(resolve =>
        request
          .get(
            `${url}/segments/${linkHash}${makeQueryString({
              process
            })}`
          )
          .end((err, res) => resolve(handleResponse(err, res)))
      );
    },

    /**
     * Finds segments.
     * @param {string} process - name of the process from which we want the segments
     * @param {object} [opts] - filtering options
     * @param {number} [opts.offset] - offset of the first segment to return
     * @param {number} [opts.limit] - maximum number of segments to return
     * @param {string[]} [opts.mapIds] - a map ID the segments must have
     * @param {string} [opts.prevLinkHash] - a previous link hash the segments must have
     * @param {string[]} [opts.linkHashes] - an array of linkHashes the segments must have
     * @param {string[]} [opts.tags] - an array of tags the segments must have
     * @returns {Promise} a promise that resolve with the segments
     */
    findSegments(process, opts) {
      const options = Object.assign({ process }, opts || {});
      return new Promise(resolve => {
        request
          .get(`${url}/segments${makeQueryString(options)}`)
          .end((err, res) => resolve(handleResponse(err, res)));
      });
    },

    /**
     * Gets map IDs.
     * @param {string} process - name of the process from which we want the segments
     * @param {object} [opts] - pagination options
     * @param {number} [opts.offset] - offset of the first map ID to return
     * @param {number} [opts.limit] - maximum number of map IDs to return
     * @returns {Promise} a promise that resolve with the map IDs
     */
    getMapIds(process, opts) {
      const options = Object.assign({ process }, opts || {});
      return new Promise((resolve, reject) => {
        request.get(`${url}/maps${makeQueryString(options)}`).end((err, res) =>
          handleResponse(err, res)
            .then(resolve)
            .catch(reject)
        );
      });
    },

    /**
     * Save an evidence
     * @param {object} evidence - evidence to be saved
     * @param {string} linkHash - linkHash related to the evidence
     * @returns {Promise} a promise that resolve with the success of the query
     */
    saveEvidence(evidence, linkHash) {
      return new Promise((resolve, reject) => {
        request
          .post(`${url}/evidences/${linkHash}`)
          .send(evidence)
          .end((err, res) =>
            handleResponse(err, res)
              .then(resolve)
              .catch(reject)
          );
      });
    }
  });

  storeHttpClient.availableStores[url] = storeClient;

  return storeClient;
}

storeHttpClient.availableStores = {};

/**
 * Returns basic information about the store HTTP clients that have been created.
 * @returns {Array} an array of store HTTP clients basic information (currently only url).
 */
export function getAvailableStores() {
  return Object.keys(storeHttpClient.availableStores).map(url => ({ url }));
}

/**
 * Clears information about the store HTTP clients created.
 * Should only be used for tests setup.
 */
export function clearAvailableStores() {
  storeHttpClient.availableStores = {};
}
