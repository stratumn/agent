/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

var React = require('react');
var ReactDOM = require('react-dom');
var IndigoExplorer = require('indigo-explorer');
import { Router, Route, browserHistory } from 'react-router';

var App = React.createClass({
	render () {
		return (
      <div>
        <Router history={browserHistory}>
          <Route path='/blockexplorer*' mount='/blockexplorer' component={IndigoExplorer} remote="localhost:46657"/>
        </Router>
        <IndigoExplorer remote="localhost:46657" />
      </div>
		);
	}
});

ReactDOM.render(<App />, document.getElementById('app'));
