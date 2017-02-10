import { Component, PropTypes, Children } from 'react';
import IndigoReader from '../IndigoReader';

export default class IndigoReaderProvider extends Component {
	constructor(props, context) {
		super(props, context);
		this.reader = props.reader;
	}

	getChildContext() {
		return { reader: this.reader };
	}

	render() {
		return Children.only(this.props.children);
	}
}

IndigoReaderProvider.propTypes = {
	children: PropTypes.element.isRequired,
	reader: PropTypes.instanceOf(IndigoReader),
};

IndigoReaderProvider.childContextTypes = {
	reader: PropTypes.instanceOf(IndigoReader),
};
