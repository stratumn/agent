/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router';

export default class SearchInput extends Component {
	constructor(props, context) {
		super(props, context);
		
    this.path = context.path;
		this.handleInputChange = this.handleInputChange.bind(this);
		this.state = { height: null };
	}

	handleInputChange(event, newValue) {
		this.setState({ height: newValue });
	}

	render() {
		return (
			<div>
				<TextField hintText="Block Height" onChange={this.handleInputChange} />
        <Link to={`${this.path}/blocks/${this.state.height}`} className='button'>Search</ Link>
			</div>
		);
	}
}

SearchInput.contextTypes = {
	path: PropTypes.string,
};
