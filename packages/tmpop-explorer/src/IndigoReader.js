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
	constructor(remote) {
		this.remote = remote;
		this.wsUrl = `ws://${this.remote}/websocket`;
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

	susbcribe(handler) {
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
		return http.get(`http://${this.remote}/${endpoint}?${encodeData(args)}`)
			.then(res => {
				if (res.body.error != ''){
					return Promise.reject(new Error(res.body.error));
				}
				return res.body.result;
			});
	}
}
