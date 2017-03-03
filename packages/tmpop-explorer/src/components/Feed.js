/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

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
