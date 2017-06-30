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
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import Layout from './containers/Layout';
import BlockContainer from './containers/BlockContainer';
import Index from './containers/Index';
import IndigoReader from './IndigoReader';
import IndigoReaderProvider from './containers/IndigoReaderProvider';
import IndigoPathProvider from './containers/IndigoPathProvider';

export default class IndigoExplorer extends Component {
  constructor(props) {
    super(props);
    const isMounted = !!this.props.route;
    const properties = isMounted ? this.props.route : this.props;

    const remote = properties.remote;
    const secure = properties.secure;

    if (!remote) {
      throw new Error('Missing indigo remote definition');
    }

    this.indigoReader = new IndigoReader(remote, secure);

		this.rootPath = isMounted ? this.props.route.mount : '/';
		this.linkPath = this.rootPath;

		if (this.linkPath.slice(-1) === '/') {
			this.linkPath = this.linkPath.slice(0, -1);
		}
  }

  render() {
    const routes = (
      <IndigoReaderProvider reader={this.indigoReader}>
        <IndigoPathProvider path={this.linkPath}>
          <Router history={browserHistory}>
            <Route path={this.rootPath} component={Layout}>
              <IndexRoute component={Index} />
              <Route path='blocks/:height' component={BlockContainer} />						
            </Route>
				  </Router>
        </IndigoPathProvider>
      </IndigoReaderProvider>
    );

    return routes;
  }
}

IndigoExplorer.propTypes = {
  remote: PropTypes.string,
  route: PropTypes.object,
  secure: PropTypes.bool,
};
