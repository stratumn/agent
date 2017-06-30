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

import httpplease from 'httpplease';
import promises from 'httpplease-promises';
import jsonresponse from 'httpplease/plugins/jsonresponse';
import hexToString from './hexToString';
import Promise from 'bluebird';

const http = httpplease.use(promises(Promise)).use(jsonresponse);

function encodeData(data) {
    return Object.keys(data).map(key =>
		[key, data[key]].map(encodeURIComponent).join('=')
	).join('&');
}   

export default class IndigoReader {
	constructor(remote, secure = false) {
		const transferProtocol = secure ? 'https' : 'http';
    this.indigoUrl = `${transferProtocol}://${remote}/`;

    const wsPrefix = secure ? 'wss' : 'ws';
		this.wsUrl = `${wsPrefix}://${remote}/websocket`;

		this.subscriptionHandlers = [];
		const ws = new WebSocket(this.wsUrl);

		ws.onmessage = (event) => {
			const block = this._parseEvent(event);

			if (block) {
				this.subscriptionHandlers.forEach(handler => handler(block));
			}
		};

        ws.onopen = () => {
			ws.send('{"jsonrpc": "2.0", "method": "subscribe", "params": ["NewBlock"]}');
		};
	}

	getGenesis() {
		return this._sendRequest('genesis');
	}

	getNetInfo() {
		return this._sendRequest('net_info');
	}

	getNumUnconfirmedTxs() {
		return this._sendRequest('num_unconfirmed_txs');
	}

	getStatus() {
		return this._sendRequest('status')
			.then(res => res[1]);
	}

	getUnconfirmedTxs() {
		return this._sendRequest('unconfirmed_txs');
	}

	getBlock(height) {
		return this._sendRequest('block', { height })
			.then(res => this._parseBlock(res[1].block));
	}

	getBlockchain(minHeight, maxHeight) {
		return this._sendRequest('blockchain', { minHeight, maxHeight });
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

	_parseEvent(event) {
		const obj = JSON.parse(event.data);

		if (obj.result[1].data) {
			return this._parseBlock(obj.result[1].data[1].block);
		}
	}

	_parseBlock(block) {
		const parsedTransactions = block.data.txs.map((tx) => {				
			const data = JSON.parse(hexToString(tx));

			return {
				data,
				block,
			};
		});

		block.data.txs = parsedTransactions;

		return block;
	}

	_sendRequest(endpoint, args = {}) {    
		return http.get(`${this.indigoUrl}${endpoint}?${encodeData(args)}`)
			.then(res => {
				if (res.body.error != ''){
					return Promise.reject(new Error(res.body.error));
				}
				return res.body.result;
			});
	}
}
