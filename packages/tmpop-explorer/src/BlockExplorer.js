var React = require('react');
var FifoArray = require('fifo-array');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

function bytesToString(array) {
	var result = '';
	for (var i = 0; i < array.length; i++) {
		result += String.fromCharCode(array[i]);
	}
	return result;
}

// Convert a hex string to a byte array
function hexToBytes(hex) {
	for (var bytes = [], c = 0; c < hex.length; c += 2) {
		bytes.push(parseInt(hex.substr(c, 2), 16));
	}
	return bytes;
}

class BlockExplorer extends React.Component {
	constructor(props) {
		super(props);

		this.maxTransactions = this.props.maxTransactions || 5;
		this.maxBlocks = this.props.maxBlocks || 5;

		this.url = `ws://${this.props.endpoint}/websocket`;
		this.handleMessage = this.handleMessage.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
		this.state = {
			blocks: new FifoArray(this.maxBlocks),
			transactions: new FifoArray(this.maxTransactions),
		};
	}

	handleMessage(event) {
		const obj = JSON.parse(event.data);

		if (obj.result[1].data) {
			const rawBlock = obj.result[1].data[1].block;

			const txs = rawBlock.data.txs;
			const blockHeight = rawBlock.header.height;
			const blockTs = rawBlock.header.time;			
			const blockHash = rawBlock.header.last_commit_hash;

			const newBlock = {
				height: blockHeight,
				timestamp: blockTs,
				transactions: txs.length,
				hash: blockHash
			};

			const newTransactions = txs.map((tx) => {				
				const t = JSON.parse(bytesToString(hexToBytes(tx)));

				return {
					data: t,
					block: newBlock,
				};
			});

			this.setState(prevState => {
				prevState.transactions.push(...newTransactions);
				prevState.blocks.push(newBlock);
				return prevState;
			});
		}
	}

	handleOpen() {
		this.ws.send('{"jsonrpc": "2.0", "method": "subscribe", "params": ["NewBlock"]}');
	}

	componentDidMount() {
		this.ws = new WebSocket(this.url);

		this.ws.onmessage = this.handleMessage;            

        this.ws.onopen = this.handleOpen;
	}	

	render () {
        const rowsBlocks = this.state.blocks.map((block) => {
			return (
				<TableRow key={block.hash}>
					<TableRowColumn style={{width: '100px'}}>{block.height}</TableRowColumn>
					<TableRowColumn style={{width: '240px'}}>{block.timestamp}</TableRowColumn>
					<TableRowColumn style={{width: '400px', fontFamily: 'Roboto Mono, Monospace'}}>{block.hash}</TableRowColumn>
					<TableRowColumn style={{width: '120px'}}>{block.transactions}</TableRowColumn>
				</TableRow>
			);
		});

        const rowsTransactions = this.state.transactions.map((tx) => {
			return (				
				<TableRow key={tx.data.meta.linkHash}>
					<TableRowColumn>{tx.block.height}</TableRowColumn>
					<TableRowColumn>{tx.data.meta.linkHash}</TableRowColumn>
					<TableRowColumn>{tx.data.link.meta.mapId}</TableRowColumn>
					<TableRowColumn>{tx.data.link.meta.stateHash}</TableRowColumn>				
					<TableRowColumn>{tx.data.link.meta.action}</TableRowColumn>				
				</TableRow>
			);
		});           

        return (
            <MuiThemeProvider>
                <div className="application" style={{width: '100%', margin: 'auto'}}>
                    <div style={{minHeight: '400px'}}>
						<h1>Blocks</h1>
						<Table selectable={false} >
							<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
							<TableRow>
								<TableHeaderColumn style={{width: '100px'}}>Height</TableHeaderColumn>
								<TableHeaderColumn style={{width: '240px'}}>Timestamp</TableHeaderColumn>
								<TableHeaderColumn style={{width: '400px'}}>Hash</TableHeaderColumn>
								<TableHeaderColumn style={{width: '120px'}}>Transactions</TableHeaderColumn>
							</TableRow>
							</TableHeader>
							<TableBody displayRowCheckbox={false}>
								{rowsBlocks}
							</TableBody>
						</Table>
                  </div>
                  <div>
					  <h1>Transactions</h1>
                      <Table selectable={false} >
						  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
						  <TableRow>
						  	  <TableHeaderColumn>Block Height</TableHeaderColumn>
						  	  <TableHeaderColumn>Link Hash</TableHeaderColumn>
						  	  <TableHeaderColumn>Map Id</TableHeaderColumn>
						  	  <TableHeaderColumn>State Hash</TableHeaderColumn>
						  	  <TableHeaderColumn>Action</TableHeaderColumn>
						  </TableRow>
						  </TableHeader>
						  <TableBody displayRowCheckbox={false}>
						  	  {rowsTransactions}
						  </TableBody>
                      </Table>
                  </div>
                </div>
            </MuiThemeProvider>
		);
	}
}

BlockExplorer.propTypes = {
	endpoint: React.PropTypes.string,
	maxBlocks: React.PropTypes.number,
	maxTransactions: React.PropTypes.number,
};

export default BlockExplorer;
