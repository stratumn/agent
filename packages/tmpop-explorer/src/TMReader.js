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

import httpplease from 'httpplease';
import promises from 'httpplease-promises';
import jsonresponse from 'httpplease/plugins/jsonresponse';

const http = httpplease.use(promises()).use(jsonresponse);

function encodeData(data) {
  return Object.keys(data)
    .map(key => [key, data[key]].map(encodeURIComponent).join('='))
    .join('&');
}

function parseBlock(block) {
  const parsedTransactions = block.data.txs.map(tx => {
    const data = JSON.parse(atob(tx));

    return {
      data,
      block
    };
  });

  block.data.txs = parsedTransactions;

  return block;
}

function parseEvent(event) {
  const obj = JSON.parse(event.data);

  if (obj.result.data) {
    return parseBlock(obj.result.data.data.block);
  }

  return {};
}

export default class TMReader {
  constructor(remote, secure = false) {
    const transferProtocol = secure ? 'https' : 'http';
    this.tmUrl = `${transferProtocol}://${remote}/`;

    const wsPrefix = secure ? 'wss' : 'ws';
    this.wsUrl = `${wsPrefix}://${remote}/websocket`;

    this.subscriptionHandlers = [];
    const ws = new WebSocket(this.wsUrl);

    ws.onmessage = event => {
      const block = parseEvent(event);

      if (block) {
        this.subscriptionHandlers.forEach(handler => handler(block));
      }
    };

    ws.onopen = () => {
      ws.send(
        `{"jsonrpc": "2.0", "method": "subscribe", "params": {"query": "tm.event='NewBlock'" }, "id": "TMReaderNewBlock"}`
      );
    };
  }

  getGenesis() {
    return this.sendRequest('genesis');
  }

  getNetInfo() {
    return this.sendRequest('net_info');
  }

  getNumUnconfirmedTxs() {
    return this.sendRequest('num_unconfirmed_txs');
  }

  getStatus() {
    return this.sendRequest('status');
  }

  getUnconfirmedTxs() {
    return this.sendRequest('unconfirmed_txs');
  }

  getBlock(height) {
    return this.sendRequest('block', {
      height
    }).then(res => parseBlock(res.block));
  }

  getBlockchain(minHeight, maxHeight) {
    return this.sendRequest('blockchain', {
      minHeight,
      maxHeight
    });
  }

  subscribe(handler) {
    this.subscriptionHandlers.push(handler);
  }

  unsubscribe(handler) {
    const index = this.subscriptionHandlers.indexOf(handler);
    if (index > -1) {
      this.subscriptionHandlers.splice(index, 1);
    }
  }

  sendRequest(endpoint, args = {}) {
    return http
      .get(`${this.tmUrl}${endpoint}?${encodeData(args)}`)
      .then(res => {
        if (res.body.error) {
          return Promise.reject(new Error(res.body.error));
        }
        return res.body.result;
      });
  }
}
