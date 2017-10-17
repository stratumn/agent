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
import filterAsync from './filterAsync';

/**
 * Creates a store HTTP client.
 *
 * The client is an EventEmitter and emits the following events:
 *   - 'open': the web socket connection was open
 *   - 'close': the web socket connection was closed
 *   - 'error': a web socket error occured
 *   - 'message': any message from web socket
 *   - 'didSave': a segment was saved
 *
 * @param {string} url - the base URL of the store
 * @param {object} [opt] - options
 * @param {string} [opt.name] - the name of the store
 * @returns {Client} a store HTTP client
 */
export default function storeHttpClient(url, opt = {}) {
  if (!storeHttpClient.availableStores.find(store => store.url === url)) {
    storeHttpClient.availableStores.push({
      name: opt.name,
      url: url
    });
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

  return Object.assign(emitter, {
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
     * Creates or updates a segment.
     * @param {string} process - name of the process from which we want the segments
     * @param {object} segment - the segment
     * @returns {Promise} a promise that resolve with the segment
     */
    saveSegment(segment) {
      return new Promise((resolve, reject) => {
        request
          .post(`${url}/segments`)
          .send(segment)
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
    getSegment(process, linkHash, filters = []) {
      let segment;
      return new Promise((resolve, reject) =>
        request
          .get(`${url}/segments/${linkHash}${makeQueryString({ process })}`)
          .end((err, res) =>
            handleResponse(err, res)
              .then(s => {
                segment = s;
                return filters.reduce(
                  (cur, filter) =>
                    cur.then(ok => Promise.resolve(ok && filter(s))),
                  Promise.resolve(true)
                );
              })
              .then(ok => {
                if (ok) {
                  resolve(segment);
                } else {
                  const error = new Error('forbidden');
                  error.status = 403;
                  error.statusCode = 403;
                  reject(error);
                }
              })
              .catch(reject)
          )
      );
    },

    /**
     * Deletes a segment.
     * @param {string} process - name of the process from which we want the segments
     * @param {string} linkHash - the link hash
     * @returns {Promise} a promise that resolve with the segment
     */
    deleteSegment(process, linkHash) {
      return new Promise((resolve, reject) => {
        request
          .del(`${url}/segments${makeQueryString({ process, linkHash })}`)
          .end((err, res) =>
            handleResponse(err, res)
              .then(resolve)
              .catch(reject)
          );
      });
    },

    /**
     * Finds segments.
     * @param {string} process - name of the process from which we want the segments
     * @param {object} [opts] - filtering options
     * @param {number} [opts.offset] - offset of the first segment to return
     * @param {number} [opts.limit] - maximum number of segments to return
     * @param {string[]} [opts.mapIds] - a map ID the segments must have
     * @param {string} [opts.prevLinkHash] - a previous link hash the segments must have
     * @param {string[]} [opts.tags] - an array of tags the segments must have
     * @returns {Promise} a promise that resolve with the segments
     */
    findSegments(process, opts, filters = []) {
      const options = Object.assign({ process }, opts || {});
      return new Promise((resolve, reject) => {
        request
          .get(`${url}/segments${makeQueryString(options)}`)
          .end((err, res) =>
            handleResponse(err, res)
              .then(s =>
                filters.reduce(
                  (cur, f) => cur.then(sgmts => filterAsync(sgmts, f)),
                  Promise.resolve(s)
                )
              )
              .then(filtered => resolve(filtered))
              .catch(reject)
          );
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
    }
  });
}

storeHttpClient.availableStores = [];

/**
 * Returns basic information about the store HTTP clients that have been created.
 * @returns {Array} an array of store HTTP clients basic information
 */
export function getAvailableStores() {
  return JSON.parse(JSON.stringify(storeHttpClient.availableStores));
}

/**
 * Clears information about the store HTTP clients created.
 * Should only be used for tests setup.
 */
export function clearAvailableStores() {
  storeHttpClient.availableStores = [];
}
