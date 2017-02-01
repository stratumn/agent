/*
    Stratumn Agent Javascript Library
    Copyright (C) 2016  Stratumn SAS

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
    getSegment(linkHash) {
      return new Promise((resolve, reject) => {
        request
          .get(`${url}/segments/${linkHash}`)
          .end((err, res) => handleResponse(err, res).then(resolve).catch(reject));
      });
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
    findSegments(opts) {
      return new Promise((resolve, reject) => {
        request
          .get(`${url}/segments${makeQueryString(opts || {})}`)
          .end((err, res) => handleResponse(err, res).then(resolve).catch(reject));
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
