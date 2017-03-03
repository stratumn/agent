/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

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
