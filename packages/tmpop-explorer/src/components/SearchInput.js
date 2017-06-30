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
