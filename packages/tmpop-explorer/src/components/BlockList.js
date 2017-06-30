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

import React, { PropTypes } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { Link } from 'react-router';

export default class BlockList extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.path = context.path;
	}

	render() {
		const rowsBlocks = this.props.blocks.map((block) => {
			return (
				<TableRow key={block.header.last_commit_hash}>
					<TableRowColumn style={{width: '100px'}}>
						<Link to={`${this.path}/blocks/${block.header.height}`}>{block.header.height}</Link>
					</TableRowColumn>
					<TableRowColumn style={{width: '240px'}}>{block.header.time}</TableRowColumn>
					<TableRowColumn style={{width: '400px', fontFamily: 'Roboto Mono, Monospace'}}>{block.header.last_commit_hash}</TableRowColumn>
					<TableRowColumn style={{width: '120px'}}>{block.data.txs.length}</TableRowColumn>
				</TableRow>
			);
		});

		return (			
			<div style={{minHeight: '400px'}}>
				<h1>Blocks</h1>
				<Table selectable={false}>
					<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
					<TableRow>
						<TableHeaderColumn style={{width: '100px'}}>Height</TableHeaderColumn>
						<TableHeaderColumn style={{width: '240px'}}>Timestamp</TableHeaderColumn>
						<TableHeaderColumn style={{width: '400px'}}>Hash</TableHeaderColumn>
						<TableHeaderColumn style={{width: '120px'}}>Transactions</TableHeaderColumn>
					</TableRow>
					</TableHeader>
					<TableBody displayRowCheckbox={false}>
						{rowsBlocks}
					</TableBody>
				</Table>
			</div>                  
		);
	}
}

BlockList.propTypes = {
	blocks: PropTypes.array
};

BlockList.contextTypes = {
	path: PropTypes.string,
};
