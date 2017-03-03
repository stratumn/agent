/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

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
		this.reader.subscribe(this.handleBlock);
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
