/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

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
