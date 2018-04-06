/*
  Copyright 2018 Stratumn SAS. All rights reserved.

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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { Link } from 'react-router';

export default class SearchInput extends Component {
  constructor(props, context) {
    super(props, context);

    this.path = context.path;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = { height: null };
  }

  handleInputChange(event) {
    this.setState({ height: event.target.value });
  }

  render() {
    return (
      <div>
        <TextField label="Block Height" onChange={this.handleInputChange} />
        <Link
          to={`${this.path}/blocks/${this.state.height}`}
          href={`${this.path}/blocks/${this.state.height}`}
          className="button"
        >
          Search
        </Link>
      </div>
    );
  }
}

SearchInput.contextTypes = {
  path: PropTypes.string
};
