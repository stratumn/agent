/*
  Copyright 2017 Stratumn SAS. All rights reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
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
