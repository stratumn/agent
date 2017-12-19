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
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Link } from 'react-router';
import SearchInput from '../components/SearchInput';

export default class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.path = context.path;
  }

  render() {
    return (
      <div>
        <h1>
          <Link to={`${this.path}/`} href={`${this.path}/`}>
            TMPop Explorer
          </Link>
        </h1>
        <MuiThemeProvider>
          <div>
            <SearchInput />
            {this.props.children}
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired
};

App.contextTypes = {
  path: PropTypes.string
};
