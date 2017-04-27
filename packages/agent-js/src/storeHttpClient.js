/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
 * @returns {Client} a store HTTP client
 */
export default function storeHttpClient(url) {
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
        request
          .get(`${url}/`)
          .end((err, res) => handleResponse(err, res).then(resolve).catch(reject));
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
     * @param {object} segment - the segment
     * @returns {Promise} a promise that resolve with the segment
     */
    saveSegment(segment) {
      return new Promise((resolve, reject) => {
        request
          .post(`${url}/segments`)
          .send(segment)
          .end((err, res) => handleResponse(err, res).then(resolve).catch(reject));
      });
    },

    /**
     * Gets a segment.
     * @param {string} linkHash - the link hash
     * @returns {Promise} a promise that resolve with the segment
     */
    getSegment(linkHash, filters = []) {
      let segment;
      return new Promise((resolve, reject) =>
        request
          .get(`${url}/segments/${linkHash}`)
          .end((err, res) => handleResponse(err, res)
            .then(s => {
              segment = s;

              return filters.reduce(
                (cur, filter) => cur.then(ok => Promise.resolve(ok && filter(s))),
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
            .catch(reject))
        );
    },

    /**
     * Deletes a segment.
     * @param {string} linkHash - the link hash
     * @returns {Promise} a promise that resolve with the segment
     */
    deleteSegment(linkHash) {
      return new Promise((resolve, reject) => {
        request
          .del(`${url}/segments/${linkHash}`)
          .end((err, res) => handleResponse(err, res).then(resolve).catch(reject));
      });
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
    findSegments(opts, filters = []) {
      return new Promise((resolve, reject) => {
        request
          .get(`${url}/segments${makeQueryString(opts || {})}`)
          .end((err, res) => handleResponse(err, res)
            .then(s => filters.reduce(
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
     * @param {object} [opts] - pagination options
     * @param {number} [opts.offset] - offset of the first map ID to return
     * @param {number} [opts.limit] - maximum number of map IDs to return
     * @returns {Promise} a promise that resolve with the map IDs
     */
    getMapIds(opts) {
      return new Promise((resolve, reject) => {
        request
          .get(`${url}/maps${makeQueryString(opts || {})}`)
          .end((err, res) => handleResponse(err, res).then(resolve).catch(reject));
      });
    }
  });
}
