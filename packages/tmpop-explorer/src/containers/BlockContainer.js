/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
