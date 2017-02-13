import React from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { Link } from 'react-router';

export default class BlockList extends React.Component {
	render() {
		const rowsBlocks = this.props.blocks.map((block) => {
			return (
				<TableRow key={block.header.last_commit_hash}>
					<TableRowColumn style={{width: '100px'}}>
						<Link to={`/blocks/${block.header.height}`}>{block.header.height}</Link>
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
	blocks: React.PropTypes.array
};
