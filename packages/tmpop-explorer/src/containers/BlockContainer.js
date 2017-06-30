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
import Block from '../components/Block';
import IndigoReader from '../IndigoReader';

export default class BlockContainer extends Component {
	constructor(props, context) {
		super(props, context);

		this.reader = this.context.reader;
		this.height = this.props.params.height;
		this.state = { block: null };

		this.handleBlockReceived = this.handleBlockReceived.bind(this);
	}

	handleBlockReceived(block) {
		this.setState({ block: block });
	}

	componentWillReceiveProps(nextProps) {
		this.height = nextProps.params.height;
		this._fetch();
	}

	componentDidMount() {
		this._fetch();
	}

	render() {
		return (
			<Block block={this.state.block} />
		);
	}

	_fetch() {
		this.reader.getBlock(this.height)
			.then(this.handleBlockReceived)
			.catch(err => console.log(err));
	}
}

BlockContainer.contextTypes = {
	reader: PropTypes.instanceOf(IndigoReader),
};

BlockContainer.propTypes = {
	params: PropTypes.object.isRequired,
};
