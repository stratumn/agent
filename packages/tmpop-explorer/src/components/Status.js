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
