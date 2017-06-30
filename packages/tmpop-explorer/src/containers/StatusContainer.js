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

import React, { Component, PropTypes } from 'react';
import Status from '../components/Status';
import IndigoReader from '../IndigoReader';

export default class StatusContainer extends Component {
	constructor(props, context) {
		super(props, context);

		this.reader = this.context.reader;
		this.state = {
			status: null,
		};	

		this.handleStatus = this.handleStatus.bind(this);
	}

	handleStatus(status) {
		this.setState({
			status: status
		});
	}

	componentDidMount() {
		this.timer = setInterval(
			() =>this.reader.getStatus().then(this.handleStatus), this.props.refreshInterval
		);
	}	

	componentWillUnmount() {
		clearTimeout(this.timer);
	}

	render() {
		return (
			<Status status={this.state.status} />
		);
	}
}

StatusContainer.contextTypes = {
	reader: PropTypes.instanceOf(IndigoReader),	
};

StatusContainer.propTypes = {
	refreshInterval: PropTypes.number,
};

StatusContainer.defaultProps = {
	refreshInterval: 1000,
};
