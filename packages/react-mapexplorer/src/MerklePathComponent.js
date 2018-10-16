/*
  Copyright 2016-2018 Stratumn SAS. All rights reserved.

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
import { MerklePathTree } from '@stratumn/mapexplorer-core';
import radium from 'radium';

class MerklePathComponent extends Component {
  componentDidMount() {
    this.tree = new MerklePathTree(this.element);

    this.display();
  }

  display() {
    this.tree.display(this.props.merklePath);
  }

  render() {
    return (
      <div
        className="merkle-path-tree"
        ref={element => {
          this.element = element;
        }}
      />
    );
  }
}

MerklePathComponent.propTypes = {
  merklePath: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default radium(MerklePathComponent);
