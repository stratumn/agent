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

let React;
let ReactDOM;
let IndigoExplorer;

if (process.env.NODE_ENV === 'development') {
  // In development, use parent module.
  React = require('../../node_modules/react');
  ReactDOM = require('../../node_modules/react-dom');
  IndigoExplorer = require('../../lib/IndigoExplorer');
} else {
  React = require('react');
  ReactDOM = require('react-dom');
  IndigoExplorer = require('indigo-explorer');
}

import './index.css';

var App = React.createClass({
	render () {
		return (
      <IndigoExplorer remote={`${location.hostname}:46657`} />
		);
	}
});

ReactDOM.render(<App />, document.getElementById('app'));
