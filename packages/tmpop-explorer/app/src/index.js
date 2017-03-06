/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

var React = require('react');
var ReactDOM = require('react-dom');
var IndigoExplorer = require('indigo-explorer');

var App = React.createClass({
	render () {
		return (
      <IndigoExplorer remote={`${location.hostname}:46657`} />
		);
	}
});

ReactDOM.render(<App />, document.getElementById('app'));
