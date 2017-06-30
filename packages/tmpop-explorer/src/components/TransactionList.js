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
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { Link } from 'react-router';

export default class TransactionList extends Component {
	render() {
		const rowsTransactions = this.props.transactions.map((tx) => {
      const segment = tx.data.segment;
			return (				
				<TableRow key={segment.meta.linkHash}>
					<TableRowColumn><Link to={`/blocks/${tx.block.header.height}`}>{tx.block.header.height}</Link></TableRowColumn>
					<TableRowColumn style={{ maxWidth: 500, overflowX: 'scroll' }}><pre>{JSON.stringify(segment.link, undefined, 2)}</pre>
          </TableRowColumn>
          <TableRowColumn style={{ maxWidth: 500, overflowX: 'scroll' }}><pre>{JSON.stringify(segment.meta, undefined, 2)}</pre>
          </TableRowColumn>
				</TableRow>
			);
		});
		return (
			<div>
				<h1>Transactions</h1>
				<Table selectable={false} style={{ tableLayout: 'auto' }} fixedHeader={false}>
					<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
					<TableRow>
						<TableHeaderColumn>Block Height</TableHeaderColumn>
						<TableHeaderColumn>Link</TableHeaderColumn>
            <TableHeaderColumn>Meta</TableHeaderColumn>
					</TableRow>
					</TableHeader>
					<TableBody displayRowCheckbox={false}>
						{rowsTransactions}
					</TableBody>
				</Table>
			</div>
		);
	}
}

TransactionList.propTypes = {
	transactions: PropTypes.array
};
