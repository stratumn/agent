/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import React, { Component, PropTypes } from 'react';
import { Table, TableBody, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import CircularProgress from 'material-ui/CircularProgress';

export default class Status extends Component {
	render() {
		const status = this.props.status;
		if (status) {
			const nodeInfo = status.node_info;
			return (
				<div>
					<h2>Node Info</h2>
					<Table selectable={false} className='compact'>
						<TableBody displayRowCheckbox={false}>
							<TableRow>
								<TableHeaderColumn>Public Key</TableHeaderColumn>
								<TableRowColumn>{nodeInfo.pub_key}</TableRowColumn>
							</TableRow>
							<TableRow>
								<TableHeaderColumn>Moniker</TableHeaderColumn>
								<TableRowColumn>{nodeInfo.moniker}</TableRowColumn>
							</TableRow>
							<TableRow>
								<TableHeaderColumn>Version</TableHeaderColumn>
								<TableRowColumn>{nodeInfo.version}</TableRowColumn>
							</TableRow>							
						</TableBody>
					</Table>

					<h2>Blockchain Info</h2>
					<Table selectable={false} className='compact'>
						<TableBody displayRowCheckbox={false}>
							<TableRow>
								<TableHeaderColumn>Latest block height</TableHeaderColumn>
								<TableRowColumn>{status.latest_block_height}</TableRowColumn>
							</TableRow>
							<TableRow>
								<TableHeaderColumn>Latest block hash</TableHeaderColumn>
								<TableRowColumn>{status.latest_block_hash}</TableRowColumn>
							</TableRow>
							<TableRow>
								<TableHeaderColumn>Latest app hash</TableHeaderColumn>
								<TableRowColumn>{status.latest_app_hash}</TableRowColumn>
							</TableRow>							
						</TableBody>
					</Table>					
				</div>
			);
		}
		return <CircularProgress />;
	}
}

Status.propTypes = {
	status: PropTypes.object,
};
