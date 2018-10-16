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

import { Component, Children } from 'react';
import PropTypes from 'prop-types';

export default class StratumnPathProvider extends Component {
  constructor(props, context) {
    super(props, context);
    this.path = props.path;
  }

  getChildContext() {
    return { path: this.path };
  }

  render() {
    return Children.only(this.props.children);
  }
}

StratumnPathProvider.propTypes = {
  children: PropTypes.element.isRequired,
  path: PropTypes.string.isRequired
};

StratumnPathProvider.childContextTypes = {
  path: PropTypes.string
};
