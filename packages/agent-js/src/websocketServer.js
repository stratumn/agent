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

import http from 'http';
import websocket from 'ws';

/**
 * Adds websocket to httpServer
 * @param {object} [httpServer] - http server
 * @param {object} [storeHttpClient] - agent store http client
 * @returns {object} - a server
 */
export default function websocketServer(app, storeHttpClient) {
  const server = http.createServer(app);
  const wss = new websocket.Server({ server });

  // Send messages on storeHttpClient message event
  storeHttpClient.on('message', msg => {
    const msgJson = JSON.stringify(msg);
    wss.clients.forEach(client => {
      client.send(msgJson);
    });
  });
  wss.on('connection', ws => {
    ws.send('Connected to agent client websocket');
  });

  return server;
}
