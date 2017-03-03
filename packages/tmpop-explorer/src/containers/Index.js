/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import React, { Component } from 'react';
import StatusContainer from './StatusContainer';
import FeedContainer from './FeedContainer';

export default class Index extends Component {
	render() {
		return (
			<div>
				<StatusContainer />
				<FeedContainer />
			</div>
		);
	}
}
