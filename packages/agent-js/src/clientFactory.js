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

const factories = {};

/**
 * Returns a client factory (for store and fossilizer clients in practice) that caches the client it creates.
 * @param {string} name
 */
function clientFactory(name) {
  if (factories[name]) {
    return factories[name];
  }

  let availableClients = {};

  const factory = {
    create(implementation, url) {
      // If we already have an existing client for that url, re-use it
      if (availableClients[url]) {
        return availableClients[url];
      }
      const client = implementation(url);
      availableClients[url] = client;
      return client;
    },

    /**
     * Returns basic information about the clients that have been created.
     * @returns {Array} an array of clients basic information (currently only url).
     */
    getAvailableClients() {
      return Object.keys(availableClients).map(url => ({
        url
      }));
    },

    /**
     * Clears information about the clients created.
     * Should only be used for tests setup.
     */
    clearAvailableClients() {
      availableClients = {};
    }
  };
  factories[name] = factory;
  return factory;
}

export const storeClientFactory = clientFactory('store');
export const fossilizerClientFactory = clientFactory('fossilizer');
