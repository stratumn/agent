import React, { Component, PropTypes } from 'react';
import BlockList from './BlockList';
import TransactionList from './TransactionList';

class Feed extends Component {
	render () {
		return (            
			<div className="application" style={{width: '100%', margin: 'auto'}}>
				<BlockList blocks={this.props.blocks} />
				<TransactionList transactions={this.props.transactions} />
			</div>            
		);
	}
}

Feed.propTypes = {
	blocks: PropTypes.array,
	transactions: PropTypes.array,
};

export default Feed;
