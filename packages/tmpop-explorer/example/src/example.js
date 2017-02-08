var React = require('react');
var ReactDOM = require('react-dom');
var BlockExplorer = require('indigo-block-explorer');

var App = React.createClass({
	render () {
		return (
			<div>
				<BlockExplorer endpoint="127.0.0.1:46657" />
			</div>
		);
	}
});

ReactDOM.render(<App />, document.getElementById('app'));
