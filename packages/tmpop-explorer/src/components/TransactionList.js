import React, { Component, PropTypes } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { Link } from 'react-router';

export default class TransactionList extends Component {
	render() {
		const rowsTransactions = this.props.transactions.map((tx) => {
			return (				
				<TableRow key={tx.data.meta.linkHash}>
					<TableRowColumn><Link to={`/blocks/tx.block.header.height`}>{tx.block.header.height}</Link></TableRowColumn>
					<TableRowColumn>{tx.data.meta.linkHash}</TableRowColumn>
					<TableRowColumn>{tx.data.link.meta.mapId}</TableRowColumn>
					<TableRowColumn>{tx.data.link.meta.stateHash}</TableRowColumn>				
					<TableRowColumn>{tx.data.link.meta.action}</TableRowColumn>				
				</TableRow>
			);
		});
		return (
			<div>
				<h1>Transactions</h1>
				<Table selectable={false} >
					<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
					<TableRow>
						<TableHeaderColumn>Block Height</TableHeaderColumn>
						<TableHeaderColumn>Link Hash</TableHeaderColumn>
						<TableHeaderColumn>Map Id</TableHeaderColumn>
						<TableHeaderColumn>State Hash</TableHeaderColumn>
						<TableHeaderColumn>Action</TableHeaderColumn>
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
