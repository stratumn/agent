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

import httpServer from './httpServer.js';
import Process from './process.js';
import getDefinedFilters from './getDefinedFilters';

/**
 * Creates an agent.
 * @param {object} options - options
 * @param {string} [options.agentUrl] - agent root url
 * @param {string} [options.evidenceCallbackUrl] - evidence callback root url
 * @returns {Agent} - an agent
 */
export default function create(options) {
  const processes = Object();
  const storeClients = [];

  function connectStoreClient(storeClient, reconnectTimeout = 5000) {
    storeClients.push(storeClient);
    // Set up events.
    storeClient.on('open', () => console.log('store: web socket open'));
    storeClient.on('close', () => console.log('store: web socket closed'));
    storeClient.on('error', err => console.error(`store: ${err.stack}`));
    storeClient.on('message', msg => {
      const eventName = msg.type;
      const process = processes[msg.data.link.meta.process];
      if (typeof process === 'object'
        && typeof process.actions.events === 'object'
        && typeof process.actions.events[eventName] === 'function') {
        const segment = msg.data;
        getDefinedFilters(process.plugins).reduce(
          (cur, filter) => cur.then(ok => Promise.resolve(ok && filter(segment))),
          Promise.resolve(true)
        ).then(ok => {
          if (ok) {
            process.actions.events[eventName](segment);
          }
        });
      }
    });

    // Connect to store web socket.
    storeClient.connect(reconnectTimeout);
  }

  function addProcess(processName, actions, storeClient, fossilizerClient, opts) {
    const updatedOpts = Object.assign(opts, options);
    const p = new Process(processName, actions, storeClient, fossilizerClient, updatedOpts);
    processes[processName] = p;
    if (storeClients.indexOf(storeClient) < 0) {
      connectStoreClient(storeClient, opts.reconnectTimeout);
    }
    return p;
  }

  return {
    /**
    * Gets information about each process created by the agent.
    * @returns {Promise} - a promise resolving with the processes' info (indexed by process name)
    */
    getInfo() {
      const processesInfo = Object.values(processes).map(p => p.getInfo());
      return Promise.all(processesInfo)
        .then(res => res.reduce((map, process) => {
          map[process.name] = process;
          return map;
        }, {}))
        .then(map => ({ processes: map }));
    },

    /**
     * Creates a process.
     * @param {String} processName - name for the process
     * @param {object} actions - the action functions
     * @param {StoreClient} storeClient - the store client
     * @param {FossilizerClient} [fossilizerClient] - the fossilizer client
     * @param {object} [opts] - options
     * @param {string} [opts.salt] - a unique salt
     * @param {number} [opts.reconnectTimeout=5000] - web socket reconnect timeout in milliseconds
     * @param {Plugins[]} [opts.plugins] - a list of agent plugins
     * @returns {Process} - the newly created Process
     */
    addProcess(processName, actions, storeClient, fossilizerClient, opts = {}) {
      if (processes[processName]) {
        const err = new Error('already exists');
        err.status = 400;
        throw err;
      }
      if (!actions || Object.keys(actions).length === 0) {
        const err = new Error('action functions are empty');
        err.status = 400;
        throw err;
      }
      return addProcess(processName, actions, storeClient, fossilizerClient, opts);
    },

    /**
     * Returns an existing process.
     * @param {String} processName - name for the process
     * @returns {Process} - a process
    */
    getProcess(processName) {
      if (!processes[processName]) {
        const err = new Error(`process '${processName}' does not exist`);
        err.status = 404;
        throw err;
      }
      return processes[processName];
    },

    /**
     * Removes a process.
     * @param {String} processName - name for the process
     * @returns {Array} - a an Array containing the updated processes
    */
    removeProcess(processName) {
      if (!processes[processName]) {
        const err = new Error(`process '${processName}' does not exist`);
        err.status = 404;
        throw err;
      }
      delete processes[processName];
      return Object.values(processes);
    },
    /**
    * Returns the processes.
    * @returns {Array} - an array containing all the processes
    */
    getAllProcesses() {
      return Object.values(processes);
    },

    /**
     * Finds segments maching a set of given criterias on a single process.
     * @param {string} processName - name of the process from which we want the segments
     * @param {object} [opts] - filtering options
     * @param {number} [opts.offset] - offset of the first segment to return
     * @param {number} [opts.limit] - maximum number of segments to return
     * @param {string[]} [opts.mapIds] - an array of map IDs the segments must have
     * @param {string} [opts.prevLinkHash] - a previous link hash the segments must have
     * @param {string[]} [opts.tags] - an array of tags the segments must have
     * @returns {Promise} - a promise that resolve with the segments
     */
    findSegments(processName, opts = {}) {
      if (!processes[processName]) {
        const err = new Error(`process '${processName}' does not exist`);
        err.status = 404;
        return Promise.reject(err);
      }
      return processes[processName].findSegments(opts);
    },

    /**
     * Gets map IDs.
     * @param {string} processName - name of the process from which we want the segments
     * @param {object} [opts] - pagination options
     * @param {number} [opts.offset] - offset of the first map ID to return
     * @param {number} [opts.limit] - maximum number of map IDs to return
     * @returns {Promise} - a promise that resolve with the map IDs
     */
    getMapIds(processName, opts = {}) {
      if (!processes[processName]) {
        const err = new Error(`process '${processName}' does not exist`);
        err.status = 404;
        return Promise.reject(err);
      }
      return processes[processName].getMapIds(opts);
    },

    /**
    * Initialize and return an http server for the agent.
    * @param {object} [opts] - options
    * @param {object} [opts.cors] - CORS options
    * @param {object} [opts.salt] - salt used for callback URLs
    * @returns {express.Server} - an express server
    */
    httpServer(opts = {}) {
      return httpServer(this, opts);
    }

  };
}
