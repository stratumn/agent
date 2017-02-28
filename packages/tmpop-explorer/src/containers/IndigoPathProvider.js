import { Component, PropTypes, Children } from 'react';

export default class IndigoPathProvider extends Component {
	constructor(props, context) {
		super(props, context);
		this.path = props.path;
	}

	getChildContext() {
		return { path: this.path };
	}

	render() {
		return Children.only(this.props.children);
	}
}

IndigoPathProvider.propTypes = {
	children: PropTypes.element.isRequired,
	path: PropTypes.string,
};

IndigoPathProvider.childContextTypes = {
	path: PropTypes.string,
};
