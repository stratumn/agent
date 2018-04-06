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

import httpServer from './httpServer';
import Process from './process';

import { getAvailableFossilizers } from './fossilizerHttpClient';
import { getAvailableStores } from './storeHttpClient';
import { FOSSILIZER_DID_FOSSILIZE_LINK, STORE_SAVED_LINKS } from './eventTypes';
import { deepGet, base64ToHex, base64ToUnicode } from './utils';

/**
 * Handle a message received from the store websocket connection
 * @param {object} msg - the actual message
 * @param {list} processes - the available processes
 */
function handleStoreEvent(msg, processes) {
  switch (msg.type) {
    case STORE_SAVED_LINKS: {
      const links = msg.data;
      links.forEach(link => {
        const process = processes[link.meta.process];
        const action = deepGet(process, `actions.events.${msg.type}`);
        if (typeof action !== 'function') return;
        process.filterLink(link).then(ok => {
          if (ok) {
            action(link);
          }
        });
      });
      break;
    }
    default:
      // event not handled
      break;
  }
}

/**
 * Handle a message received from the fossilizer websocket connection
 * @param {object} msg - the actual message
 * @param {list} processes - the available processes
 */
export function handleFossilizerEvent(msg, processes) {
  switch (msg.type) {
    case FOSSILIZER_DID_FOSSILIZE_LINK: {
      // Save the evidence in the store
      if (!msg.data.Data) {
        console.error(
          'fossilizer: unexpected event from websocket - missing Data '
        );
      }
      if (!msg.data.Meta) {
        console.error(
          'fossilizer: unexpected event from websocket - missing Meta'
        );
      }
      const linkHash = base64ToHex(msg.data.Data);
      const processName = base64ToUnicode(msg.data.Meta);
      const process = processes[processName];
      if (process) process.saveEvidence(linkHash, msg.data.Evidence);
      break;
    }
    default:
      // event not handled
      break;
  }
}

/**
 * Creates an agent.
 * @param {object} options - options
 * @param {string} [options.agentUrl] - agent root url
 * @returns {Agent} - an agent
 */
export default function create(options) {
  const processes = Object();
  const connectedStoreClients = [];
  const connectedFossilizerClients = [];
  const activePlugins = {};
  let activePluginsCount = 0;

  function connectStoreClient(storeClient, reconnectTimeout = 5000) {
    connectedStoreClients.push(storeClient);
    // Set up events.
    storeClient.on('open', () => console.log('store: web socket open'));
    storeClient.on('close', () => console.log('store: web socket closed'));
    storeClient.on('error', err => console.error(`store: ${err.stack}`));
    storeClient.on('message', msg => handleStoreEvent(msg, processes));

    // Connect to store web socket.
    storeClient.connect(reconnectTimeout);
  }

  function connectFossilizerClient(fossilizerClient, reconnectTimeout = 5000) {
    connectedFossilizerClients.push(fossilizerClient);
    // Set up events.
    fossilizerClient.on('open', () =>
      console.log('fossilizer: web socket open')
    );
    fossilizerClient.on('close', () =>
      console.log('fossilizer: web socket closed')
    );
    fossilizerClient.on('error', err =>
      console.error(`fossilizer: ${err.stack}`)
    );
    fossilizerClient.on('event', msg => handleFossilizerEvent(msg, processes));

    // Connect to store web socket.
    fossilizerClient.connect(reconnectTimeout);
  }

  function addProcess(
    processName,
    actions,
    storeClient,
    fossilizerClients,
    opts
  ) {
    // Store active plugins for re-use
    if (opts.plugins) {
      opts.plugins.map(plugin => {
        // We don't want to re-add the exact same plugin instance twice
        if (
          Object.keys(activePlugins).find(id => plugin === activePlugins[id])
        ) {
          return activePluginsCount;
        }

        activePluginsCount += 1;
        activePlugins[activePluginsCount] = plugin;
        return activePluginsCount;
      });
    }

    const updatedOpts = Object.assign(opts, options);

    const p = new Process(
      processName,
      actions,
      storeClient,
      fossilizerClients,
      updatedOpts
    );
    processes[processName] = p;
    if (connectedStoreClients.indexOf(storeClient) < 0) {
      connectStoreClient(storeClient, opts.reconnectTimeout);
    }

    // Connect unconnected fossilizer clients
    if (p.fossilizerClients) {
      p.fossilizerClients.forEach(
        fc =>
          connectedFossilizerClients.indexOf(fc) < 0 &&
          connectFossilizerClient(fc)
      );
    }

    return p;
  }

  return {
    getActivePlugins() {
      return activePlugins;
    },

    /**
    * Gets information about each process created by the agent.
    * @returns {Promise} - a promise resolving with the processes' info (indexed by process name)
    */
    getInfo() {
      return this.getAllProcesses()
        .then(res =>
          res.reduce((map, process) => {
            map[process.name] = process;
            return map;
          }, {})
        )
        .then(map => ({
          processes: map,
          stores: getAvailableStores(),
          fossilizers: getAvailableFossilizers(),
          plugins: Object.keys(activePlugins).map(plugin => ({
            id: plugin,
            name: activePlugins[plugin].name,
            description: activePlugins[plugin].description
          }))
        }));
    },

    /**
     * Creates a process.
     * @param {String} processName - name for the process
     * @param {object} actions - the action functions
     * @param {StoreClient} storeClient - the store client
     * @param {FossilizerClient[]} [fossilizerClients] - an array of fossilizer clients
     * @param {object} [opts] - options
     * @param {number} [opts.reconnectTimeout=5000] - web socket reconnect timeout in milliseconds
     * @param {Plugins[]} [opts.plugins] - a list of agent plugins
     * @returns {Process} - the newly created Process
     */
    addProcess(
      processName,
      actions,
      storeClient,
      fossilizerClients,
      opts = {}
    ) {
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
      return addProcess(
        processName,
        actions,
        storeClient,
        fossilizerClients,
        opts
      );
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
      return this.getAllProcesses();
    },

    /**
    * Returns the processes.
    * @returns {Array} - an array containing all the processes
    */
    getAllProcesses() {
      const processesInfo = Object.values(processes).map(p => p.getInfo());
      return Promise.all(processesInfo);
    },

    /**
     * Finds segments maching a set of given criterias on a single process.
     * @param {string} processName - name of the process from which we want the segments
     * @param {object} [opts] - filtering options
     * @param {number} [opts.offset] - offset of the first segment to return
     * @param {number} [opts.limit] - maximum number of segments to return
     * @param {string[]} [opts.mapIds] - an array of map IDs the segments must have
     * @param {string} [opts.prevLinkHash] - a previous link hash the segments must have
     * @param {string[]} [opts.linkHashes] - an array of linkHashes the segments must have
     * @param {string[]} [opts.tags] - an array of tags the segments must have
     * @returns {Promise} - a promise that resolve with the segments
     */
    findSegments(processName, opts = {}) {
      return this.delegatePromiseToProcess(processName, 'findSegments', opts);
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
      return this.delegatePromiseToProcess(processName, 'getMapIds', opts);
    },

    /**
    * Initialize and return an http server for the agent.
    * @param {object} [opts] - options
    * @param {object} [opts.cors] - CORS options
    * @returns {express.Server} - an express server
    */
    httpServer(opts = {}) {
      return httpServer(this, opts);
    },

    delegatePromiseToProcess(processName, func, opts) {
      try {
        const process = this.getProcess(processName);
        return process[func](opts);
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}
