/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
