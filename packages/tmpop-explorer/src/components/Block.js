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

import React, { Component } from 'react';
import TransactionList from './TransactionList';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import CircularProgress from 'material-ui/CircularProgress';
import Radium, { Style } from 'radium';

class Block extends Component {
	getRules() {
		return {
			'td, th': {
				padding: '10px 24px !important',
				height: 'inherit !important',
			},
			tr: {
				height: 'inherit !important',
			},
			'thead th': {
				fontWeight: 'bold !important',
			},
			'table.compact': {
				width: 'inherit !important'
			}		
		};
	}

	getStyles() {
		return {
			block: {
				display: 'flex',
				flexDirection: 'row',
				flexWrap: 'wrap',
				justifyContent: 'space-between',
			},
			margin: {
				marginTop: 40,
			}
		};
	}

	render() {
    const block = this.props.block;

		if (block) {
			const header = block.header;
			const txs = block.data.txs;
			const rules = this.getRules();
			const styles = this.getStyles();

			return (
				<div>
					<Style
						rules={rules}
					/>
					<h1>Block #{header.height}</h1>
					<div style={styles.block}>						
						<Table selectable={false} className='compact'>
							<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
								<TableRow>
									<TableHeaderColumn>Summary</TableHeaderColumn>							
								</TableRow>
							</TableHeader>
							<TableBody displayRowCheckbox={false}>
								<TableRow>
									<TableHeaderColumn>Chain ID</TableHeaderColumn>
									<TableRowColumn>{header.chain_id}</TableRowColumn>
								</TableRow>
								<TableRow>
									<TableHeaderColumn>Height</TableHeaderColumn>
									<TableRowColumn>{header.height}</TableRowColumn>
								</TableRow>
								<TableRow>
									<TableHeaderColumn>Timestamp</TableHeaderColumn>
									<TableRowColumn>{header.time}</TableRowColumn>
								</TableRow>
								<TableRow>
									<TableHeaderColumn>Number Of Transactions</TableHeaderColumn>
									<TableRowColumn>{header.num_txs}</TableRowColumn>
								</TableRow>													
							</TableBody>
						</Table>
						<Table selectable={false}  className='compact'>
							<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
								<TableRow>
									<TableHeaderColumn>Hashes</TableHeaderColumn>							
								</TableRow>
							</TableHeader>
							<TableBody displayRowCheckbox={false}>
								<TableRow>
									<TableHeaderColumn>Hash</TableHeaderColumn>
									<TableRowColumn>{header.last_commit_hash}</TableRowColumn>
								</TableRow>
								<TableRow>
									<TableHeaderColumn>Previous Block</TableHeaderColumn>
									<TableRowColumn>{header.last_block_id.hash}</TableRowColumn>
								</TableRow>
								<TableRow>
									<TableHeaderColumn>Validators Hash</TableHeaderColumn>
									<TableRowColumn>{header.validators_hash}</TableRowColumn>
								</TableRow>
								<TableRow>
									<TableHeaderColumn>Application Hash</TableHeaderColumn>
									<TableRowColumn>{header.app_hash}</TableRowColumn>
								</TableRow>
							</TableBody>
						</Table>
						<div style={styles.margin}>
							<Table selectable={false} style={{ tableLayout: 'auto' }} fixedHeader={false}>
								<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
									<TableRow>
										<TableHeaderColumn>Signatures</TableHeaderColumn>
										<TableHeaderColumn />
									</TableRow>
									<TableRow>
										<TableHeaderColumn>Address</TableHeaderColumn>
										<TableHeaderColumn>Signature</TableHeaderColumn>
									</TableRow>
								</TableHeader>
								<TableBody displayRowCheckbox={false}>
									{block.last_commit.precommits.map(precommit => {
										if (precommit) {
											return (
                        <TableRow key={precommit.validator_address}>
                          <TableRowColumn>{precommit.validator_address}</TableRowColumn>
                          <TableRowColumn>{precommit.signature.data}</TableRowColumn>
                        </TableRow>
                      );
										}
                  })}						
								</TableBody>
							</Table>
						</div>
					</div>
					<div style={styles.margin}>
						<TransactionList transactions={txs}/>
					</div>
				</div>
			);
		}
		return <CircularProgress />;
	}
}

Block.propTypes = {
	block: React.PropTypes.object,
};

export default Radium(Block);
