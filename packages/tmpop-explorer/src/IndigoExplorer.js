/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import React, { Component } from 'react';
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
    this.indigoReader = new IndigoReader(this.props.route.remote);
		this.rootPath = this.props.route.mount;
		this.linkPath = this.rootPath;

		if (this.linkPath.slice(-1) == '/') {
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
  route: React.PropTypes.object.isRequired,
};
