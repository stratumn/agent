import React, { Component, PropTypes } from 'react';
import Feed from '../components/Feed';
import IndigoReader from '../IndigoReader';
import FifoArray from 'fifo-array';

export default class FeedContainer extends Component {

	constructor(props, context) {
		super(props, context);

		this.reader = this.context.reader;
		this.state = {
			blocks: new FifoArray(this.props.maxBlocks),
			transactions: new FifoArray(this.props.maxTransactions),
		};	

		this.handleBlock = this.handleBlock.bind(this);
	}

	handleBlock(block) {
		this.setState(prevState => {
			prevState.transactions.push(...block.data.txs);
			prevState.blocks.push(block);
			return prevState;
		});
	}

	componentDidMount() {
		this.reader.susbcribe(this.handleBlock);
	}	

	componentWillUnmount() {
		this.reader.unsubscribe(this.handleBlock);
	}

	render() {
		return (
			<Feed blocks={this.state.blocks} transactions={this.state.transactions} />
		);
	}
}

FeedContainer.contextTypes = {
	reader: PropTypes.instanceOf(IndigoReader),	
};

FeedContainer.defaultProps = {
	maxBlocks: 5,
	maxTransactions: 5,
};

FeedContainer.propTypes = {
	maxBlocks: PropTypes.number,
	maxTransactions: PropTypes.number,
};
