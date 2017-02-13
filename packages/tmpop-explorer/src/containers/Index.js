import React, { Component } from 'react';
import StatusContainer from './StatusContainer';
import FeedContainer from './FeedContainer';

export default class Index extends Component {
	render() {
		return (
			<div>
				<StatusContainer />
				<FeedContainer />
			</div>
		);
	}
}
