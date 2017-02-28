import React, { Component, PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Link } from 'react-router';
import SearchInput from '../components/SearchInput';

export default class App extends Component {
	constructor(props, context) {
		super(props, context);
		this.path = context.path;
		console.log(this.path);
	}

	render() {
		return (
			<div>
				<h1><Link to={`${this.path}/`}>Indigo Explorer</Link></h1>
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
	children: PropTypes.object,
};

App.contextTypes = {
	path: PropTypes.string,
};
