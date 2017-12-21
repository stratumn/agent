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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Block from '../components/Block';
import TMReader from '../TMReader';

export default class BlockContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.reader = this.context.reader;
    this.height = this.props.params.height;
    this.state = { block: null };

    this.handleBlockReceived = this.handleBlockReceived.bind(this);
  }

  componentDidMount() {
    this.fetch();
  }

  componentWillReceiveProps(nextProps) {
    this.height = nextProps.params.height;
    this.fetch();
  }

  handleBlockReceived(block) {
    this.setState({ block: block });
  }

  fetch() {
    this.reader
      .getBlock(this.height)
      .then(this.handleBlockReceived)
      .catch(err => console.log(err));
  }

  render() {
    return <Block block={this.state.block} />;
  }
}

BlockContainer.contextTypes = {
  reader: PropTypes.instanceOf(TMReader)
};

BlockContainer.propTypes = {
  params: PropTypes.shape({
    height: PropTypes.number
  }).isRequired
};
