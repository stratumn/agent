import React, { Component, PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Link } from 'react-router';

export default class App extends Component {
	render() {
		return (
			<div>
				<h1><Link to={'/'}>Indigo Explorer</Link></h1>				
				<MuiThemeProvider>
					{this.props.children}
				</MuiThemeProvider>
			</div>
		);
	}
}

App.propTypes = {
	children: PropTypes.object,
};


