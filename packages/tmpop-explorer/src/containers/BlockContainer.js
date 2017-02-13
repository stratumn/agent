import React, { Component, PropTypes } from 'react';
import Block from '../components/Block';
import IndigoReader from '../IndigoReader';

export default class BlockContainer extends Component {
	constructor(props, context) {
		super(props, context);

		this.reader = this.context.reader;
		this.height = this.props.params.height;
		this.state = { block: null };

		this.handleBlockReceived = this.handleBlockReceived.bind(this);
	}

	handleBlockReceived(block) {
		this.setState({ block: block });
	}

	componentDidMount() {
		this.reader.getBlock(this.height)
			.then(this.handleBlockReceived)
			.catch(err => console.log(err));
	}

	render() {
		return (
			<Block block={this.state.block} />
		);
	}
}

BlockContainer.contextTypes = {
	reader: PropTypes.instanceOf(IndigoReader),
};

BlockContainer.propTypes = {
	params: PropTypes.object,
};
