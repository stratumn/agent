var React = require('react');
var ReactDOM = require('react-dom');
var IndigoExplorer = require('indigo-explorer');
import { Router, Route, browserHistory } from 'react-router';

var App = React.createClass({
	render () {
		return (
			<Router history={browserHistory}>
				<Route path='/*' mount='/blockexplorer' component={IndigoExplorer} remote="localhost:46657"/>
			</Router>
		);
	}
});

ReactDOM.render(<App />, document.getElementById('app'));
