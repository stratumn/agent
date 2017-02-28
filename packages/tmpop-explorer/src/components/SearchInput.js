import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { Link } from 'react-router';

export default class SearchInput extends Component {
	constructor(props) {
		super(props);
		
		this.handleInputChange = this.handleInputChange.bind(this);
		this.state = { height: null };
	}

	handleInputChange(event, newValue) {
		this.setState({ height: newValue });
	}

	render() {
		const style = {
			border: '1px solid black',
			padding: '5px',
		};

		return (
			<div>
				<TextField hintText="Block Height" onChange={this.handleInputChange} />
				<Link to={`/blocks/${this.state.height}`} style={style}>Search</Link>
			</div>
		);
	}
}
