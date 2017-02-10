import React, { Component, PropTypes } from 'react';
import Status from '../components/Status';
import IndigoReader from '../IndigoReader';

export default class StatusContainer extends Component {

	constructor(props, context) {
		super(props, context);

		this.reader = this.context.reader;
		this.state = {
			status: null,
		};	

		this.handleStatus = this.handleStatus.bind(this);
	}

	handleStatus(status) {
		this.setState({
			status: status
		});
	}

	componentDidMount() {
		this.timer = setInterval(
			() =>this.reader.getStatus().then(this.handleStatus), this.props.refreshInterval
		);
	}	

	componentWillUnmount() {
		console.log('will unmount');
		clearTimeout(this.timer);
	}

	render() {
		return (
			<Status status={this.state.status} />
		);
	}
}

StatusContainer.contextTypes = {
	reader: PropTypes.instanceOf(IndigoReader),	
};

StatusContainer.propTypes = {
	refreshInterval: PropTypes.number,
};

StatusContainer.defaultProps = {
	refreshInterval: 1000,
};
