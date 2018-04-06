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
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import Layout from './containers/Layout';
import BlockContainer from './containers/BlockContainer';
import Index from './containers/Index';
import TMReader from './TMReader';
import TMReaderProvider from './containers/TMReaderProvider';
import IndigoPathProvider from './containers/IndigoPathProvider';

export default class TMPopExplorer extends Component {
  constructor(props) {
    super(props);
    const isMounted = !!this.props.route;
    const { remote, secure } = isMounted ? this.props.route : this.props;

    if (!remote) {
      throw new Error('Missing indigo remote definition');
    }

    this.tmReader = new TMReader(remote, secure);

    this.rootPath = isMounted ? this.props.route.mount : '/';
    this.linkPath = this.rootPath;

    if (this.linkPath.slice(-1) === '/') {
      this.linkPath = this.linkPath.slice(0, -1);
    }
  }

  render() {
    const routes = (
      <TMReaderProvider reader={this.tmReader}>
        <IndigoPathProvider path={this.linkPath}>
          <Router history={browserHistory}>
            <Route path={this.rootPath} component={Layout}>
              <IndexRoute component={Index} />
              <Route path="blocks/:height" component={BlockContainer} />
            </Route>
          </Router>
        </IndigoPathProvider>
      </TMReaderProvider>
    );

    return routes;
  }
}

TMPopExplorer.propTypes = {
  /* eslint-disable react/no-unused-prop-types */
  remote: PropTypes.string,
  route: PropTypes.shape({
    mount: PropTypes.string
  }),
  secure: PropTypes.bool
  /* eslint-enable react/no-unused-prop-types */
};

TMPopExplorer.defaultProps = {
  remote: '',
  route: false,
  secure: false
};
